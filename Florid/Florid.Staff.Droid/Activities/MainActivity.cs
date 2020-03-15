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
using Florid.Staff.Droid.Services;
using Android.Runtime;
using Android.Content;
using JaiselRahman.FilePickerLib.Activities;
using JaiselRahman.FilePickerLib.Models;
using System.IO;

namespace Florid.Staff.Droid.Activity
{
    [Activity]
    public class MainActivity : BaseActivity
    {
        static readonly string TAG = "MainActivity";

        public const int REQUEST_FILE_PICKER = 2;

        protected override int LayoutId => Resource.Layout.activity_main;
        protected override bool UseOwnLayout => true;

        private WebView _mainWebView;
        private View _mask;

        protected override void InitView(ViewGroup viewGroup)
        {
            _mainWebView = FindViewById<WebView>(Resource.Id.mainWebview);
            _mask = FindViewById<View>(Resource.Id.mask);

            _mainWebView.ClearCache(true);

            WebSettings settings = _mainWebView.Settings;
            settings.JavaScriptEnabled = true;
            settings.SetEnableSmoothTransition(true);
            settings.DomStorageEnabled = true;
            settings.SetSupportZoom(false);

            _mainWebView.SetWebViewClient(new WebViewClient());
            _mainWebView.SetWebChromeClient(new MyWebChromeClient());

            var javascriptClient = new JavascriptClient(this, _mainWebView, (email, password) =>
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
            _mainWebView.LoadUrl(BaseModelHelper.Instance.RootWebUrl);

#if DEBUG
            WebView.SetWebContentsDebuggingEnabled(true);
#endif

            SetStatusBarColor(true);


            //MainApp.ConnectToBluetoothDevice( "DC:0D:30:2F:49:8F", (isSuccess) =>
            //{

            //});
        }

        public void ShowMask()
        {
            _mask.Visibility = ViewStates.Visible;
        }

        public void DismissMask()
        {
            _mask.Visibility = ViewStates.Gone;
        }

        public override void OnBackPressed()
        {
            DroidUtility.ExecJavaScript(_mainWebView, "backNavigate()");
        }

        protected override void OnActivityResult(int requestCode, [GeneratedEnum] Result resultCode, Intent data)
        {
            base.OnActivityResult(requestCode, resultCode, data);

            if (resultCode != Result.Ok)
                return;

            if (requestCode == REQUEST_FILE_PICKER)
            {
                var file = (MediaFile)data.GetParcelableArrayListExtra(FilePickerActivity.MediaFiles)[0];
                var path = file.Path;
                var size = file.Size;

                using (var bitmap = BitmapFactory.DecodeFile(path))
                {
                    using (var scaled = GetResizedBitmap(bitmap, 700))
                    {
                        var stream = new MemoryStream();
                        if (path.Contains(".png") || path.Contains(".PNG"))
                            scaled.Compress(Bitmap.CompressFormat.Png, 100, stream);
                        else
                            scaled.Compress(Bitmap.CompressFormat.Jpeg, 100, stream);
                        var bytes = stream.ToArray();

                        var encoded = Base64.GetEncoder().EncodeToString(bytes);

                        DroidUtility.ExecJavaScript(_mainWebView, "fileChosen(\"" + encoded + "\")");
                    }

                }

            }

        }

        public Bitmap GetResizedBitmap(Bitmap image, int maxSize)
        {
            int width = image.Width;
            int height = image.Height;

            float bitmapRatio = (float)width / (float)height;
            if (bitmapRatio > 1)
            {
                width = maxSize;
                height = (int)(width / bitmapRatio);
            }
            else
            {
                height = maxSize;
                width = (int)(height * bitmapRatio);
            }
            return Bitmap.CreateScaledBitmap(image, width, height, true);
        }

    }



}