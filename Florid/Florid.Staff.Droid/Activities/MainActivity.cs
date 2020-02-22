using Android.App;
using Android.OS;
using Android.Support.V7.App;
using Android.Widget;
using Android.Util;
using Firebase.Iid;
using Firebase.Messaging;
using Android.Gms.Common;
using Firebase.Database;
using Florid.Entity;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Firebase.Database.Query;
using Florid.Core.Service;
using Florid.Core;
using Android.Views;
using Android.Webkit;
using Florid.Droid.Lib.Static;
using Newtonsoft.Json;
using Florid.Model;

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
            settings.SetSupportZoom(true);

            _mainWebView.SetWebViewClient(new WebViewClient());
            _mainWebView.SetWebChromeClient(new WebChromeClient());

            var javascriptClient = new JavascriptClient(this, (email, password) => {

            }, (type, data) => {

                switch (type)
                {
                    case EntityType.User:
                        var user = (JsonConvert.DeserializeObject<GenericModel<User>>(data)).Data;

                        break;
                    default:
                        break;
                }
            });

            javascriptClient.SetPrimaryDarkStatusBar = (isDark) =>
            {
                SetStatusBarColor(isDark);
            };

            _mainWebView.AddJavascriptInterface(javascriptClient, "Android");
            _mainWebView.LoadUrl("http://192.168.1.28:5000");

            SetStatusBarColor(true);
        }
    }
}