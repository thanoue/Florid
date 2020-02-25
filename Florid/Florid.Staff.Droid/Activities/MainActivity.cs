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
using Android.Graphics;
using System.IO;
using Java.Net;
using Firebase.Storage;
using static Firebase.Storage.StreamDownloadTask;
using System;
using Florid.Staff.Droid.Static;
using System.Threading;
using Florid.Staff.Droid.Services;

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

            var javascriptClient = new JavascriptClient(this, (email, password) =>
            {

            }, (type, data) =>
            {

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

            javascriptClient.DoPrintJob = (url) =>
            {
                MainApp.DoPrintJob(url);
            };

            _mainWebView.AddJavascriptInterface(javascriptClient, "Android");
            _mainWebView.LoadUrl("https://floridstaff.firebaseapp.com");

            SetStatusBarColor(true);


            MainApp.ConnectToBluetoothDevice( "DC:0D:30:2F:49:8F", (isSuccess) =>
            {
              
            });
        }

      
        //void ExportBitmapAsPNG(Bitmap bitmap)
        //{
        //    var sdCardPath = Android.OS.Environment.ExternalStorageDirectory.AbsolutePath;
        //    var filePath = System.IO.Path.Combine(sdCardPath, "test2.png");
        //    var stream = new FileStream(filePath, FileMode.Create);
        //    bitmap.Compress(Bitmap.CompressFormat.Png, 100, stream);
        //    stream.Close();
        //}
    }
}