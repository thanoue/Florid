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
using Florid.Core;
using Android.Content.Res;
using Asksira.WebViewSuiteLib;
using static Asksira.WebViewSuiteLib.WebViewSuite;

namespace Florid.Staff.Droid.Activity
{
    [Activity(MainLauncher =true)]
    public class MainActivity : BaseActivity , IWebViewSetupInterference
    {
        static readonly string TAG = "MainActivity";

        public const int REQUEST_FILE_PICKER = 2;
        public const int REQUEST_INTERNET_SALE_REQUEST = 3;

        protected override int LayoutId => Resource.Layout.activity_main;
        protected override bool UseOwnLayout => true;

        private WebViewSuite _mainWebView;
        private View _mask;
        private JavascriptClient _javascriptClient;

        public void InterfereWebViewSetup(WebView webView)
        {
            WebSettings settings = webView.Settings;

            settings.JavaScriptEnabled = true;
            settings.SetEnableSmoothTransition(true);
            settings.DomStorageEnabled = true;
            settings.SetSupportZoom(false);

            settings.MixedContentMode = MixedContentHandling.AlwaysAllow;

            //settings.LoadsImagesAutomatically = true;

            //settings.BlockNetworkImage = false;
            //settings.BlockNetworkLoads = false;

            webView.ClearCache(true);

            webView.SetWebViewClient(new WebViewClient());
            webView.SetWebChromeClient(new MyWebChromeClient());
            webView.AddJavascriptInterface(_javascriptClient, "Android");

        }

        protected override void InitView(ViewGroup viewGroup)
        {
            _mainWebView = FindViewById<WebViewSuite>(Resource.Id.mainWebview);
            _mask = FindViewById<View>(Resource.Id.mask);

            _mainWebView.ToggleProgressbar(false);

            _mainWebView.InterfereWebViewSetup(this);

            _javascriptClient = new JavascriptClient(this, _mainWebView.WebView, (email, password) =>
             {

             });

            _javascriptClient.SetPrimaryDarkStatusBar = (isDark) =>
            {
                SetStatusBarColor(isDark);
            };

            _javascriptClient.DoPrintJob = (data) =>
            {
                MainApp.ConnectToBluetoothDevice("DC:0D:30:2F:49:8F", (isSuccess) =>
                {
                    if (!isSuccess)
                        return;

                    AssetManager assets = Assets;
                    var sr = new StreamReader(assets.Open("receiptTemplate.html"));
                    var template = sr.ReadToEnd();

                    template = template.Replace("{{OrderId}}", data.OrderId);
                    template = template.Replace("{{CreatedDate}}", data.CreatedDate);

                    var productTemplate = @"<tr>
                        <td>{0}</td>
                        <td>
                            <p>{1}</p>
                        </td>
                        <td>{2}<span> +{3} </span></td>
   
                       </tr>";

                    long saleTotal = 0;
                    var saleItemContainer = "";

                    foreach(var product in data.SaleItems)
                    {
                        saleItemContainer += string.Format(productTemplate, product.Index, product.ProductName, product.Price.VNCurrencyFormat(), product.AdditionalFee.VNCurrencyFormat());
                        saleTotal += product.Price;
                    }

                    template = template.Replace("{{SaleItems}}", saleItemContainer);

                    template = template.Replace("{{SaleTotal}}", saleTotal.VNCurrencyFormat());
                    template = template.Replace("{{TotalAmount}}", data.TotalAmount.VNCurrencyFormat());
                    template = template.Replace("{{TotalPaidAmount}}", data.TotalPaidAmount.VNCurrencyFormat());
                    template = template.Replace("{{TotalBalance}}", data.TotalBalance.VNCurrencyFormat());

                    template = template.Replace("{{VATIncluded}}", data.VATIncluded ? "Đã bao gồm VAT": "");

                    template = template.Replace("{{DiscountPercent}}", data.MemberDiscount.ToString());
                    template = template.Replace("{{ScoreUsed}}", data.ScoreUsed.ToString());
                    template = template.Replace("{{GainedScore}}", data.GainedScore.ToString());
                    template = template.Replace("{{TotalScore}}", data.TotalScore.ToString());

                    var task = new CustomAsyncTask(this, template);
                    task.Execute();
                });
            };

            _mainWebView.StartLoading(BaseModelHelper.Instance.RootWebUrl);

#if DEBUG
            WebView.SetWebContentsDebuggingEnabled(true);
#endif

            SetStatusBarColor(true);
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
            DroidUtility.ExecJavaScript(_mainWebView.WebView, "backNavigate()");
        }

        protected override void OnActivityResult(int requestCode, [GeneratedEnum] Result resultCode, Intent data)
        {
            base.OnActivityResult(requestCode, resultCode, data);

            if (resultCode != Result.Ok)
                return;

            switch (requestCode)
            {
                case REQUEST_FILE_PICKER:

                    var file = (MediaFile)data.GetParcelableArrayListExtra(FilePickerActivity.MediaFiles)[0];
                    var path = file.Path;
                    var size = file.Size;

                    using (var bitmap = BitmapFactory.DecodeFile(path))
                    {
                        using (var scaled = GetResizedBitmap(bitmap, 900))
                        {
                            var stream = new MemoryStream();
                            if (path.Contains(".png") || path.Contains(".PNG"))
                                scaled.Compress(Bitmap.CompressFormat.Png, 100, stream);
                            else
                                scaled.Compress(Bitmap.CompressFormat.Jpeg, 100, stream);
                            var bytes = stream.ToArray();

                            var encoded = Base64.GetEncoder().EncodeToString(bytes);

                            DroidUtility.ExecJavaScript(_mainWebView.WebView, "fileChosen(\"" + encoded + "\")");
                        }

                    }

                    break;

                case REQUEST_INTERNET_SALE_REQUEST:
                    var res = data.GetStringExtra(Constants.pBankingSaleResData);
                    DroidUtility.ExecJavaScript(_mainWebView.WebView, "internetSaleDone(\"" + res + "\")");
                    break;
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