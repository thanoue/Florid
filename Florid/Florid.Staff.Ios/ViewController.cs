using CoreGraphics;
using Foundation;
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

        public ViewController(IntPtr handle) : base(handle)
        {
        }

        public override void ViewDidLoad()
        {
            base.ViewDidLoad();
            // Perform any additional setup after loading the view, typically from a nib.

            var url = new NSUrl("https://floridstaff.web.app");
           // var url = new NSUrl("http://192.168.1.157:4200");

            _webView.LoadRequest(new NSUrlRequest(url));

            _webView.AllowsBackForwardNavigationGestures = true;
        }

        public override void LoadView()
        {
            base.LoadView();

            var preferences = new WKPreferences();
            preferences.JavaScriptEnabled = true;


            var contentController = new WKUserContentController();
            contentController.AddScriptMessageHandler(this, "callback");

            var config = new WKWebViewConfiguration();
            config.Preferences = preferences;
            config.UserContentController = contentController;

            _webView = new WKWebView(CGRect.Empty, config);

            _webView.NavigationDelegate = this;
            View = _webView;
        }

        public async void  DidReceiveScriptMessage(WKUserContentController userContentController, WKScriptMessage message)
        {
            try
            {
                var img = message.Body.ToString();

                if (img.Contains("FLORID"))
                {
                    var parts = img.Split("FLORID");
                    img = parts[1];

                    await Clipboard.SetTextAsync(parts[0]);
                }

                img = img.Replace("data:image/png;base64,", "").Replace("data:image/jpeg;base64,", "");

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
            }
            catch (Exception EX)
            {
                return;
            }
           
        }
    }
}