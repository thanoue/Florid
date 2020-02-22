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
using Florid.Droid.Lib.Static;
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
        ImageView _testImage;
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            // Create your application here
            SetContentView(Resource.Layout.SplashLayout);

            _testImage = FindViewById<ImageView>(Resource.Id.testImage); 

            using (Stream input = Assets.Open("reciptTemplate.html"))
            {
                using (var reader = new StreamReader(input))
                {
                    var val = reader.ReadToEnd();

                    RunOnUiThread(() =>
                    {
                        var _mainWebview = new WebView(this);
                        var paramsLayout = new RelativeLayout.LayoutParams(Android.Views.ViewGroup.LayoutParams.MatchParent, Android.Views.ViewGroup.LayoutParams.MatchParent);
                        _mainWebview.LayoutParameters = paramsLayout;

                        var myWebViewClient = new MyWebViewClient();
                        myWebViewClient.OnPageFinishedEvt += (sender, e) =>
                        {
                            (new Handler()).PostDelayed(() =>
                            {
                                using (Picture picture = _mainWebview.CapturePicture())
                                {
                                    Bitmap bmp = Bitmap.CreateBitmap(picture.Width, picture.Height, Bitmap.Config.Argb4444);
                                    Canvas canvas = new Canvas(bmp);
                                    picture.Draw(canvas);

                                    _testImage.SetImageBitmap(bmp);

                                    ExportBitmapAsPNG(bmp);
                                }
                            }, 1000);
                        };

                        _mainWebview.Settings.UseWideViewPort = true;
                        _mainWebview.Settings.LoadWithOverviewMode = true;
                        _mainWebview.SetWebViewClient(myWebViewClient);
                        _mainWebview.SetInitialScale(96);
                        _mainWebview.SetWebChromeClient(new WebChromeClient());
                        _mainWebview.LoadDataWithBaseURL("", val, "text/html", "UTF-8", "");

                    });
                }
            }
        }

        void ExportBitmapAsPNG(Bitmap bitmap)
        {
            var sdCardPath = Android.OS.Environment.ExternalStorageDirectory.AbsolutePath;
            var filePath = System.IO.Path.Combine(sdCardPath, "test2.png");
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