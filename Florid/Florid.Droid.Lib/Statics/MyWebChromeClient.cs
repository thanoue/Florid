using System;
using Android.Net.Http;
using Android.Webkit;

namespace Florid.Droid.Lib
{
    public class MyWebChromeClient : WebChromeClient
    {
        public MyWebChromeClient()
        {
        }

        [Obsolete]
        public override void OnConsoleMessage(string message, int lineNumber, string sourceID)
        {
            base.OnConsoleMessage(message, lineNumber, sourceID);
        }

        public override void OnGeolocationPermissionsShowPrompt(string origin, GeolocationPermissions.ICallback callback)
        {
            callback?.Invoke(origin, true, false);
        }
    }

    public class MyWebClient : WebViewClient
    {
        public override void OnReceivedSslError(WebView view, SslErrorHandler handler, SslError error)
        {
            handler.Proceed();
            //base.OnReceivedSslError(view, handler, error);
        }
    }
}
