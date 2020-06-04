using Android.App;
using Android.OS;
using Florid.Entity;
using Android.Views;
using Android.Webkit;
using Florid.Droid.Lib.Static;
using Newtonsoft.Json;
using Florid.Model;
using Android.Graphics;
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
using ME.Echodev.Resizer;
using Firebase.Auth;
using Android.Gms.Tasks;
using Android.Widget;
using Florid.Core.Service;
using Firebase.Database;
using Android.Net;
using Android.Util;
using Base64 = Java.Util.Base64;
using Android.Support.V4.Content;

namespace Florid.Staff.Droid.Activity
{
    [Activity(MainLauncher = true)]
    public class MainActivity : BaseActivity, IWebViewSetupInterference
    {
        static readonly string TAG = "MainActivity";

        public const int REQUEST_FILE_PICKER = 2;
        public const int REQUEST_FILE_PICKER_SHARE = 4;
        public const int REQUEST_INTERNET_SALE_REQUEST = 3;
        protected override int LayoutId => Resource.Layout.activity_main;
        protected override bool UseOwnLayout => true;

        private WebViewSuite _mainWebView;
        private View _mask;
        private JavascriptClient _javascriptClient;
        private string _savedFileUrl = "";

        private INormalDBSession<FirebaseClient> _normalDbSession => ServiceLocator.Instance.Get<INormalDBSession<FirebaseClient>>();

        public void InterfereWebViewSetup(WebView webView)
        {
            WebSettings settings = webView.Settings;

            settings.JavaScriptEnabled = true;
            settings.SetEnableSmoothTransition(true);
            settings.DomStorageEnabled = true;
            settings.SetSupportZoom(false);

            settings.MixedContentMode = MixedContentHandling.AlwaysAllow;

            webView.ClearCache(true);

            webView.SetWebViewClient(new WebViewClient());
            webView.SetWebChromeClient(new MyWebChromeClient());

            _javascriptClient = new JavascriptClient(this, webView, (email, password, idToken) =>
              {
                  if (MainApp.IsPrinter())
                  {
                      _normalDbSession.Authenticate(idToken);
                      BaseModelHelper.Instance.ReceiptPrintJobRepo.ItemAddedRegister(item =>
                      {
                          MainApp.ConnectToBluetoothDevice("DC:0D:30:2F:49:8F", (isSuccess) =>
                          {
                              if (!isSuccess)
                                  return;

                              var task = new CustomAsyncTask(this, this.BindingReceiptData(item));
                              task.Execute();
                          });

                      });
                  }
              });

            _javascriptClient.LogoutCallback = () =>
            {
                _normalDbSession.Logout();
            };

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

                    var task = new CustomAsyncTask(this, this.BindingReceiptData(data));
                    task.Execute();
                });
            };

            webView.AddJavascriptInterface(_javascriptClient, "Android");

        }

        protected override void InitView(ViewGroup viewGroup)
        {
            _mainWebView = FindViewById<WebViewSuite>(Resource.Id.mainWebview);
            _mask = FindViewById<View>(Resource.Id.mask);

            _mainWebView.ToggleProgressbar(false);

            _mainWebView.InterfereWebViewSetup(this);

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

        public override void StartActivityForResult(Intent intent, int requestCode)
        {
            base.StartActivityForResult(intent, requestCode);
        }

        public override void  ShareImage()
        {
            Intent share = new Intent(Intent.ActionSend);
            share.SetType(_savedFileUrl.Contains(".png") ? "image/png" : "image/jpeg");

            var photoFile = new Java.IO.File(_savedFileUrl);

            if (Build.VERSION.SdkInt >= BuildVersionCodes.N)
            {
                Uri photoURI = FileProvider.GetUriForFile(this,
                                              "com.florid.staff.fileprovider",
                                              photoFile);

                share.PutExtra(Intent.ExtraStream, photoURI);

            }
            else

                share.PutExtra(Intent.ExtraStream, Uri.FromFile(photoFile));

            StartActivity(Intent.CreateChooser(share, "Share Image"));
        }

        public override void ReleaseTempImage()
        {
            if (!string.IsNullOrEmpty(_savedFileUrl))
            {
                File.Delete(_savedFileUrl);
                Log.Debug("Florid", "Temp image is deleted");
            }
        }

        private string CreateImageFile(string sourceFilePath)
        {
            var ext = sourceFilePath.Contains(".png") ? ".png" : ".jpeg";

            var storageDir = GetExternalFilesDir(Android.OS.Environment.DirectoryPictures);

            var imagePath = new Java.IO.File(storageDir, "Florid_images");

            Log.Debug("Florid", imagePath.AbsolutePath);

            if (!imagePath.Exists() && !imagePath.Mkdirs())
            {
                Log.Debug("Florid", "failed to create directory");
            }

            string imageFileName = (System.DateTime.Now).ToString("yyyyMMdd_HHmmss") + ext;
            var image = new Java.IO.File(imagePath, imageFileName);


            File.Copy(sourceFilePath, image.AbsolutePath);

            return image.AbsolutePath;
        }

        protected override void OnActivityResult(int requestCode, [GeneratedEnum] Result resultCode, Intent data)
        {
            base.OnActivityResult(requestCode, resultCode, data);

            if (resultCode != Result.Ok)
                return;

            MediaFile file;
            string path;
            Java.IO.File sourceFile;

            switch (requestCode)
            {
                case REQUEST_FILE_PICKER_SHARE:

                     file = (MediaFile)data.GetParcelableArrayListExtra(FilePickerActivity.MediaFiles)[0];
                     path = file.Path;

                    _savedFileUrl = CreateImageFile(path);

                    sourceFile = new Java.IO.File(_savedFileUrl);

                    using (var resizedImage = new Resizer(this)
                       .SetTargetLength(1080)
                       .SetQuality(40)
                       .SetSourceImage(sourceFile)
                       .SetOutputFormat("png")
                       .ResizedBitmap)
                    {
                        var stream = new MemoryStream();

                        resizedImage.Compress(Bitmap.CompressFormat.Png, 1, stream);

                        var bytes = stream.ToArray();

                        var encoded = Base64.GetEncoder().EncodeToString(bytes);

                        DroidUtility.ExecJavaScript(_mainWebView.WebView, "fileChosen(\"" + encoded + "\")");

                        stream.Close();
                    }
                    break;

                case REQUEST_FILE_PICKER:

                     file = (MediaFile)data.GetParcelableArrayListExtra(FilePickerActivity.MediaFiles)[0];
                     path = file.Path;

                     sourceFile = new Java.IO.File(path);

                    using (var resizedImage = new Resizer(this)
                        .SetTargetLength(1080)
                        .SetQuality(40)
                        .SetSourceImage(sourceFile)
                        .SetOutputFormat("png")
                        .ResizedBitmap)
                    {
                        var stream = new MemoryStream();

                        resizedImage.Compress(Bitmap.CompressFormat.Png, 1, stream);

                        var bytes = stream.ToArray();

                        var encoded = Base64.GetEncoder().EncodeToString(bytes);

                        DroidUtility.ExecJavaScript(_mainWebView.WebView, "fileChosen(\"" + encoded + "\")");

                        stream.Close();

                    }

                    break;

                case REQUEST_INTERNET_SALE_REQUEST:
                    var res = data.GetStringExtra(Constants.pBankingSaleResData);
                    DroidUtility.ExecJavaScript(_mainWebView.WebView, "internetSaleDone(\"" + res + "\")");
                    break;
            }

        }

        private Bitmap rotateBitmap(Bitmap bitmap, int degrees)
        {
            if (degrees == 0 || null == bitmap)
            {
                return bitmap;
            }
            Matrix matrix = new Matrix();
            matrix.SetRotate(degrees, bitmap.Width / 2, bitmap.Height / 2);
            Bitmap bmp = Bitmap.CreateBitmap(bitmap, 0, 0, bitmap.Width, bitmap.Height, matrix, true);
            if (null != bitmap)
            {
                bitmap.Recycle();
            }
            return bmp;
        }

    }
}