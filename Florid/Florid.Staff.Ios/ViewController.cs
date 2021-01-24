using CoreGraphics;
using Florid.Core;
using Florid.Core.Services;
using Foundation;
using Newtonsoft.Json;
using Photos;
using System;
using System.Buffers.Text;
using System.IO;
using System.Security.Policy;
using UIKit;
using WebKit;
using Xamarin.Essentials;

namespace Florid.Staff.Ios
{
    public partial class ViewController : UIViewController, IWKScriptMessageHandler, IWKNavigationDelegate
    {
        WKWebView _webView;
        private string _sessionLoginName = "";
        private string _sessionPassCode = "";
        private bool _isLoaded = false;
        ISecureStorageService SecureStorage => ServiceLocator.Instance.Get<ISecureStorageService>();

        public ViewController(IntPtr handle) : base(handle)
        {
        }

        public override void ViewDidLoad()
        {
            base.ViewDidLoad();
        }

        public override void LoadView()
        {
            base.LoadView();
        }

        public override void ViewDidAppear(bool animated)
        {
            base.ViewDidAppear(animated);

            if (_isLoaded)
                return;

            _isLoaded = true;

            string source = @"var meta = document.createElement('meta');
                meta.name = 'viewport';
                meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
                var head = document.getElementsByTagName('head')[0];
                head.appendChild(meta);";

            var script = new WKUserScript(new NSString(source),WKUserScriptInjectionTime.AtDocumentEnd, true);
            _webView.Configuration.UserContentController.AddUserScript(script);
        }

        public override void ViewDidLayoutSubviews()
        {
            base.ViewDidLayoutSubviews();

            if (_webView != null)
                return;

            var preferences = new WKPreferences();
            preferences.JavaScriptEnabled = true;

            var contentController = new WKUserContentController();
            contentController.AddScriptMessageHandler(this, "callback");

            var config = new WKWebViewConfiguration();
            config.Preferences = preferences;
            config.UserContentController = contentController;

            _webView = new WKWebView(CGRect.Empty, config);
            _webView.NavigationDelegate = this;

            _webView.Frame = View.Frame;

            View.Add(_webView);

            var url = new NSUrl("https://florid-day.xyz");
           // var url = new NSUrl("http://172.16.4.35:4200");

            _webView.LoadRequest(new NSUrlRequest(url));

            _webView.AllowsBackForwardNavigationGestures = true;
        }

        public async void DidReceiveScriptMessage(WKUserContentController userContentController, WKScriptMessage message)
        {
            try
            {
                var val = message.Body.ToString();

                var dataModel = JsonConvert.DeserializeObject<NativeSendingModel>(val);

                switch (dataModel.DataType)
                {
                    case NativeSendingModel.TYPE_VIEW_IMG:

                        var url = dataModel.Data;

                        var viewImg = new ViewProductImageViewController(url);

                        viewImg.ModalPresentationStyle = UIModalPresentationStyle.OverCurrentContext;
                        viewImg.ModalTransitionStyle = UIModalTransitionStyle.CrossDissolve;
                        this.PresentModalViewController(viewImg, true);

                        break;

                    case NativeSendingModel.TYPE_SHARING_IMG:

                        var imgModel = JsonConvert.DeserializeObject<ImageSharingModel>(dataModel.Data);

                        if (!string.IsNullOrEmpty(imgModel.ContactInfo))
                        {

                            await Clipboard.SetTextAsync(imgModel.ContactInfo);
                        }

                        var img = imgModel.ImgData.Replace("data:image/png;base64,", "").Replace("data:image/jpeg;base64,", "");

                        var data = new NSData(img, NSDataBase64DecodingOptions.IgnoreUnknownCharacters);

                        var image = new UIImage(data);

                        PHPhotoLibrary.RequestAuthorization(status =>
                        {
                            if (status != PHAuthorizationStatus.Authorized)
                                return;

                            this.InvokeOnMainThread(() =>
                            {
                                var activityItems = new NSObject[] { image };

                                var activityController = new UIActivityViewController(activityItems, null);

                                PresentViewController(activityController, true, () => { });
                            });
                        });
                        break;
                    case NativeSendingModel.TYPE_MOBILE_LOGIN:

                        var loginModel = JsonConvert.DeserializeObject<LoginModel>(dataModel.Data);

                        _sessionLoginName = loginModel.LoginName;
                        _sessionPassCode = loginModel.Passcode;

                        break;

                    case NativeSendingModel.TYPE_IS_REMEMBER_CHECKING:

                        if (!SecureStorage.Exist(Constants.SECURE_LOGIN_NAME) || !SecureStorage.Exist(Constants.SECURE_PASSCODE))
                        {
                            //check
                            _webView.EvaluateJavaScript("rememberPassConfirm()",(res,err)=> {

                            });

                            return;
                        }

                        if (SecureStorage.Fetch(Constants.SECURE_LOGIN_NAME) != (_sessionLoginName))
                        {
                            //check
                            _webView.EvaluateJavaScript("rememberPassConfirm()", (res, err) => {

                            });

                            return;
                        }

                        break;

                    case NativeSendingModel.TYPE_PASSWORD_CLEARING:

                        SecureStorage.Remove(Constants.SECURE_LOGIN_NAME);
                        SecureStorage.Remove(Constants.SECURE_PASSCODE);

                        break;

                    case NativeSendingModel.TYPE_PASSWORD_SAVING:

                        SecureStorage.Store(Constants.SECURE_LOGIN_NAME, _sessionLoginName);
                        SecureStorage.Store(Constants.SECURE_PASSCODE, _sessionPassCode);

                        break;

                    case NativeSendingModel.TYPE_SAVED_LOGGIN_GETTING_REQUEST:

                        var password = SecureStorage.Fetch(Constants.SECURE_PASSCODE);
                        var loginName = SecureStorage.Fetch(Constants.SECURE_LOGIN_NAME);

                        if (string.IsNullOrEmpty(loginName))
                            return;

                        _webView.EvaluateJavaScript("savedLoginInforReturn(\"" + loginName + "\",\"" + password + "\")", (res, err) => {

                        });

                        break;
                }

            }
            catch (Exception EX)
            {
                Console.WriteLine(EX);
                return;
            }

        }
    }

    public class ImageSharingModel
    {
        [JsonProperty("contactInfo")]
        public string ContactInfo { get; set; }

        [JsonProperty("imgData")]
        public string ImgData { get; set; }
    }

    public class NativeSendingModel
    {
        public const string TYPE_SHARING_IMG = "sharingImg";
        public const string TYPE_SAVED_LOGGIN_GETTING_REQUEST = "savedLoginInforGettingRequest";
        public const string TYPE_IS_REMEMBER_CHECKING = "isRememberPassChecking";
        public const string TYPE_MOBILE_LOGIN = "mobileLogin";
        public const string TYPE_PASSWORD_SAVING = "passwordSaving";
        public const string TYPE_PASSWORD_CLEARING = "passwordClearing";
        public const string TYPE_VIEW_IMG = "viewImage";


        [JsonProperty("dataType")]
        public string DataType { get; set; }

        [JsonProperty("data")]
        public string Data { get; set; }
    }


    public class LoginModel
    {
        [JsonProperty("loginName")]
        public string LoginName { get; set; }

        [JsonProperty("passcode")]
        public string Passcode { get; set; }
    }
}