using Android.App;
using Android.OS;
using Florid.Entity;
using Android.Views;
using Android.Webkit;
using Florid.Droid.Lib.Static;
using Newtonsoft.Json;
using Florid.Model;
using Android.Graphics;
using System;
using Java.Util;
using Florent37.SingleDateAndTimePickerLib.Dialogs;
using Florid.Droid.Lib;

namespace Florid.Staff.Droid.Activity
{
    [Activity]
    public class MainActivity : BaseActivity
    {
        static readonly string TAG = "MainActivity";
        protected override int LayoutId => Resource.Layout.activity_main;
        protected override bool UseOwnLayout => true;

        private WebView _mainWebView;

        protected override void InitView(ViewGroup viewGroup)
        {
            _mainWebView = FindViewById<WebView>(Resource.Id.mainWebview);

            _mainWebView.ClearCache(true);

            WebSettings settings = _mainWebView.Settings;
            settings.JavaScriptEnabled = true;
            settings.SetEnableSmoothTransition(true);
            settings.DomStorageEnabled = true;
            settings.SetSupportZoom(false);

            _mainWebView.SetWebViewClient(new WebViewClient());
            _mainWebView.SetWebChromeClient(new MyWebChromeClient());

            var javascriptClient = new JavascriptClient(this,_mainWebView, (email, password) =>
            {

            });

            javascriptClient.SetPrimaryDarkStatusBar = (isDark) =>
            {
                SetStatusBarColor(isDark);
            };

            javascriptClient.DoPrintJob = (url) =>
            {
                MainApp.DoPrintJob(url);
            };

            _mainWebView.AddJavascriptInterface(javascriptClient, "Android");
            _mainWebView.LoadUrl("http://192.168.1.23:4200");

#if DEBUG
            WebView.SetWebContentsDebuggingEnabled(true);
#endif

            SetStatusBarColor(true);


            //MainApp.ConnectToBluetoothDevice( "DC:0D:30:2F:49:8F", (isSuccess) =>
            //{

            //});
        }




    }



}