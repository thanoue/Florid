using CoreGraphics;
using Foundation;
using System;
using System.Security.Policy;
using UIKit;
using WebKit;

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

        public void DidReceiveScriptMessage(WKUserContentController userContentController, WKScriptMessage message)
        {
            try
            {
                ObjCRuntime.Class.ThrowOnInitFailure = false;

                var img = message.Body.ToString();

                var data = new NSData(img, NSDataBase64DecodingOptions.IgnoreUnknownCharacters);

                var image = new UIImage(data);

                var activityItems = new NSObject[] { image };
                var controller = new UIActivityViewController(activityItems, null);
                this.PresentViewController(controller, true, null);

            }
            catch (Exception EX)
            {
                return;
            }
           
        }
    }
}