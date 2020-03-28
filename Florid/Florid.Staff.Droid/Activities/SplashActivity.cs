using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.Content.Res;
using Android.Graphics;
using Android.OS;
using Android.Runtime;
using Android.Support.V7.App;
using Android.Views;
using Android.Webkit;
using Android.Widget;
using Com.Izettle.Html2bitmap;
using Com.Izettle.Html2bitmap.Content;
using Firebase.Auth;
using Florid.Droid.Lib;
using Florid.Droid.Lib.Static;
using Java.IO;

namespace Florid.Staff.Droid.Activity
{
    public class CustomConfig : Html2BitmapConfigurator
    {
        public override void ConfigureWebView(WebView webview)
        {
            base.ConfigureWebView(webview);
            webview.SetBackgroundColor(Color.Black);
            webview.Settings.TextZoom = 100;
        }
    }

    public class CustomAsyncTask : AsyncTask
    {
        SplashActivity _context;
        public CustomAsyncTask(SplashActivity context)
        {
            _context = context;
        }

        protected override Java.Lang.Object DoInBackground(params Java.Lang.Object[] @params)
        {
            string content;
            AssetManager assets = _context.Assets;
            var sr = new StreamReader(assets.Open("reciptTemplate.html"));
            content = sr.ReadToEnd();

            var html2BitmapConfigurator = new CustomConfig();

            var build = new Html2Bitmap.Builder()
            .SetContext(_context)
            .SetContent(WebViewContent.Html(content))
            .SetBitmapWidth(420)
            .SetMeasureDelay(10)
            .SetScreenshotDelay(10)
            .SetStrictMode(true)
            .SetTimeout(5)
            .SetTextZoom((Java.Lang.Integer)120)
            .SetConfigurator(html2BitmapConfigurator)
            .Build();

            var bitmap = build.Bitmap;


            return bitmap;
        }

        protected override void OnPostExecute(Java.Lang.Object result)
        {
            _context.MainApp.DoPrintJob((Bitmap)result);
            _context.TestImage.SetImageBitmap((Bitmap)result);
            base.OnPostExecute(result);
        }
    }

    [Activity(MainLauncher = true)]
    public class SplashActivity : BaseActivity
    {
        protected override int LayoutId => Resource.Layout.SplashLayout;
        public ImageView TestImage;
        protected override void InitView(ViewGroup viewGroup)
        {
        }

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            TestImage = FindViewById<ImageView>(Resource.Id.resImg);
            // Create your application here

            FindViewById<Button>(Resource.Id.goBtn).Click += delegate
            {
                MainApp.ConnectToBluetoothDevice("DC:0D:30:2F:49:8F", (isSuccess) =>
                {
                    if (isSuccess)
                    {
                        var task = new CustomAsyncTask(this);
                        task.Execute();
                    }

                });

            

                //BaseModelHelper.Instance.RootWebUrl = FindViewById<EditText>(Resource.Id.urlTxt).Text;

                //StartActivity(new Intent(this, typeof(MainActivity)));
            };


        }

        protected override void OnResume()
        {
            base.OnResume();
            //var handler = new Handler();
            //handler.PostDelayed(() =>
            //{
            //    if (FirebaseAuth.Instance.CurrentUser != null)
            //    {
            //        RunOnUiThread(() =>
            //        {
            //            StartActivity(typeof(MainActivity));
            //        });
            //    }
            //    else
            //    {
            //        RunOnUiThread(() =>
            //        {
            //            StartActivity(typeof(MainActivity));
            //        });
            //    }
            //}, 1000);
        }
    }
}