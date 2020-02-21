using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.Graphics;
using Android.OS;
using Android.Runtime;
using Android.Support.V7.App;
using Android.Views;
using Android.Webkit;
using Android.Widget;
using Firebase.Auth;
using Java.IO;

namespace Florid.Staff.Droid.Activity
{
    public class MyWebViewClient : WebViewClient
    {
        public EventHandler<bool> OnPageFinishedEvt;

        public override void OnPageFinished(WebView view, string url)
        {
            base.OnPageFinished(view, url);
            OnPageFinishedEvt?.Invoke(this, true);
        }
    }

    [Activity(Theme = "@style/AppTheme", MainLauncher = true, NoHistory = true)]
    public class SplashActivity : AppCompatActivity
    {
        WebView _mainWebview;
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            // Create your application here
            SetContentView(Resource.Layout.SplashLayout);

            _mainWebview = FindViewById<WebView>(Resource.Id.mainWebview);
            var myWebViewClient = new MyWebViewClient();
            myWebViewClient.OnPageFinishedEvt = (sender, e) =>
            {
                (new Handler()).PostDelayed(() =>
                {
                    using (Picture picture = _mainWebview.CapturePicture())
                    {

                        Bitmap bmp = Bitmap.CreateBitmap(picture.Width, picture.Height, Bitmap.Config.Argb8888);
                        Canvas canvas = new Canvas(bmp);
                        picture.Draw(canvas);

                        ExportBitmapAsPNG(bmp);
                    }
                }, 500);
            };


            using (Stream input = Assets.Open("reciptTemplate.html"))
            {
                using (var reader = new StreamReader(input))
                {
                    var val = reader.ReadToEnd();

                    _mainWebview.LoadDataWithBaseURL("", val, "text/html", "UTF-8", "");
                    _mainWebview.SetWebViewClient(myWebViewClient);
                }
            }

        }

        void ExportBitmapAsPNG(Bitmap bitmap)
        {
            var sdCardPath = Android.OS.Environment.ExternalStorageDirectory.AbsolutePath;
            var filePath = System.IO.Path.Combine(sdCardPath, "test.png");
            var stream = new FileStream(filePath, FileMode.Create);
            bitmap.Compress(Bitmap.CompressFormat.Png, 100, stream);
            stream.Close();
        }

        protected override void OnResume()
        {
            base.OnResume();
            //var handler = new Handler();
            //handler.PostDelayed(() =>
            //{
            //    if(FirebaseAuth.Instance.CurrentUser != null)
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