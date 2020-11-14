using System;
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
            webview.Settings.TextZoom = 115;
        }
    }

    public class CustomAsyncTask : AsyncTask
    {
        BaseActivity _context;
        string _content;
        Action _doneCallback;
        public CustomAsyncTask(BaseActivity context, string content, Action doneCallback)
        {
            _content = content;
            _context = context;
            _doneCallback = doneCallback;
        }

        protected override Java.Lang.Object DoInBackground(params Java.Lang.Object[] @params)
        {

            var html2BitmapConfigurator = new CustomConfig();

            var build = new Html2Bitmap.Builder()
            .SetContext(_context)
            .SetContent(WebViewContent.Html(_content))
            .SetBitmapWidth(420)
            .SetMeasureDelay(10)
            .SetScreenshotDelay(10)
            .SetStrictMode(true)
            .SetTimeout(5)
            .SetTextZoom((Java.Lang.Integer)100)
            .SetConfigurator(html2BitmapConfigurator)
            .Build();

            var bitmap = build.Bitmap;


            return bitmap;
        }

        protected override void OnPostExecute(Java.Lang.Object result)
        {
            base.OnPostExecute(result);
            _context.MainApp.DoPrintJob((Bitmap)result, _doneCallback);
        }
    }
}