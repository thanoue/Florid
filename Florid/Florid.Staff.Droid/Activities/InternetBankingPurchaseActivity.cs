
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Webkit;
using Android.Widget;
using Asksira.WebViewSuiteLib;
using Florid.Core;
using Florid.Droid.Lib;
using Florid.Staff.Droid.Services;

namespace Florid.Staff.Droid.Activity
{
    [Activity]
    public class InternetBankingPurchaseActivity : BaseActivity,WebViewSuite.IWebViewSetupInterference
    {
        WebViewSuite _webView;
        protected override int LayoutId => Resource.Layout.webview_layout;

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
             
        }

        protected override void InitView(ViewGroup viewGroup)
        {
            _webView = FindViewById<WebViewSuite>(Resource.Id.webViewSuite);

            _webView.InterfereWebViewSetup(this);

            var url = Intent.GetStringExtra(Constants.pBankingSaleUrl);

            _webView.StartLoading(url);
        }

        public void InterfereWebViewSetup(WebView webView)
        {
            WebSettings settings = webView.Settings;
            settings.JavaScriptEnabled = true;
            settings.SetEnableSmoothTransition(true);
            settings.DomStorageEnabled = true;
            settings.SetSupportZoom(false);

            webView.SetWebViewClient(new WebViewClient());
            webView.SetWebChromeClient(new MyWebChromeClient());

            var javascriptClient = new JavascriptClient(this, webView, (email, password,idtoken) =>
            {

            });

            javascriptClient.SetPrimaryDarkStatusBar = (isDark) =>
            {
                SetStatusBarColor(isDark);
            };

            javascriptClient.BankingSaleReturn = (data) =>
            {
                var intent = new Intent();
                intent.PutExtra(Constants.pBankingSaleResData, data);

                SetResult(Result.Ok, intent);
            };

            webView.AddJavascriptInterface(javascriptClient, "Android");

        }
    }
}
