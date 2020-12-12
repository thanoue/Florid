using System;
using System.Diagnostics.CodeAnalysis;
using Android.App;
using Android.Graphics;
using Android.OS;
using Android.Support.V7.App;
using Android.Views;
using Com.Jsibbold.Zoomage;
using Java.Net;

namespace Florid.Staff.Droid.Activity
{
    [Activity(Theme = "@style/AppTheme", WindowSoftInputMode = SoftInput.AdjustResize)]
    public class ViewImgActivity: AppCompatActivity
    {
        protected override void OnCreate(Bundle savedInstanceState)
        {
            RequestWindowFeature(WindowFeatures.NoTitle);
            Window.SetFlags(WindowManagerFlags.Fullscreen, WindowManagerFlags.Fullscreen);

            base.OnCreate(savedInstanceState);

            SetContentView(Resource.Layout.activity_view_img);

            var imgUrl = Intent.GetStringExtra("URL");

            if (!string.IsNullOrEmpty(imgUrl))
            {
                var img = FindViewById<ZoomageView>(Resource.Id.demoView);

                var task = new DownloadImg(img);

                task.Execute(imgUrl);
            }

        }

        public override void Finish()
        {
            GC.Collect();
            base.Finish();
        }

        public class DownloadImg : AsyncTask<string,int,Bitmap>
        {
            ZoomageView _img;

            public DownloadImg(ZoomageView img)
            {
                _img = img;
            }

            protected override Bitmap RunInBackground(params string[] @params)
            {
                var url = @params[0];
                Bitmap logo = null;

                try
                {
                    var str = new URL(url).OpenStream();
                    /*
                        decodeStream(InputStream is)
                            Decode an input stream into a bitmap.
                     */
                    logo = BitmapFactory.DecodeStream(str);
                }
                catch (Java.Lang.Exception e)
                { // Catch the download exception
                    e.PrintStackTrace();
                }

                return logo;
            }

            protected override void OnPostExecute([AllowNull] Bitmap result)
            {
                _img.SetImageBitmap(result);
            }
        }
    }
}
