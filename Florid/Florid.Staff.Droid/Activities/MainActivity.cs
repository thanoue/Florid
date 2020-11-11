using Android.App;
using Android.OS;
using Android.Views;
using Android.Webkit;
using Florid.Droid.Lib.Static;
using Newtonsoft.Json;
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
using Android.Widget;
using Android.Net;
using Android.Util;
using Base64 = Java.Util.Base64;
using Android.Support.V4.Content;
using Florid.Core.Services;
using Android.Support.V4.App;
using Android;
using Android.Content.PM;
using Xamarin.Essentials;
using System;
using Uri = Android.Net.Uri;
using FileProvider = Android.Support.V4.Content.FileProvider;
using System.Linq;
using System.Threading;
using Florid.Staff.Droid.AsyncTasks;

namespace Florid.Staff.Droid.Activity
{
    [Activity(MainLauncher = true)]
    public class MainActivity : BaseActivity, IWebViewSetupInterference
    {
        static readonly string TAG = "MainActivity";

        public const int REQUEST_FILE_PICKER = 2;
        public const int REQUEST_FILE_PICKER_SHARE = 4;
        public const int REQUEST_INTERNET_SALE_REQUEST = 3;
        public const int REQUEST_SHARING_NEW_IMG = 5;
        protected override int LayoutId => Resource.Layout.activity_main;

        protected override bool UseOwnLayout => true;
        const int PRINTER_DISCONNECT_TIMEOUT = 60 * 1000;

        private WebViewSuite _mainWebView;
        private View _mask;
        private JavascriptClient _javascriptClient;
        private string _savedFileUrl = "";
        private string _newSharingImgPath;
        private string _sessionLoginName = "";
        private string _sessionPassCode = "";

        public void InterfereWebViewSetup(WebView webView)
        {
            WebSettings settings = webView.Settings;

            settings.JavaScriptEnabled = true;
            settings.SetEnableSmoothTransition(true);
            settings.DomStorageEnabled = true;
            settings.SetSupportZoom(false);
            settings.SetGeolocationDatabasePath(this.FilesDir.AbsolutePath);
            settings.SetGeolocationEnabled(true);
            settings.JavaScriptCanOpenWindowsAutomatically = true;
            settings.BuiltInZoomControls = true;


            settings.MixedContentMode = MixedContentHandling.AlwaysAllow;

            webView.ClearCache(true);

            webView.SetWebChromeClient(new MyWebChromeClient());
            webView.SetWebViewClient(new MyWebClient());

            _javascriptClient = new JavascriptClient(this, webView);

            var printerDisconnectHandler = new Handler();


            _javascriptClient.SetPrimaryDarkStatusBar = (isDark) =>
            {
                SetStatusBarColor(isDark);
            };

            _javascriptClient.DoPrintJob = (data) =>
             {
                 MainApp.CurrentPrintJob = data;
                 var printText = this.BindingReceiptData(data);

                 AsyncEscPosPrinter printer = new AsyncEscPosPrinter(null, 203, 48f, 32);
                 printer.SetTextToPrint(printText);

                 var task = new AsyncBluetoothEscPosPrint("DC:0D:30:2F:49:8F", this, () =>
                 {
                     DroidUtility.ExecJavaScript(_mainWebView.WebView, "reprintOrderConfirm()");
                 });

                 task.Execute(printer);


                 //MainApp.ConnectToBluetoothDevice("DC:0D:30:2F:49:8F", (isSuccess) =>
                 //{
                 //    printerDisconnectHandler.RemoveCallbacks(DisConnectPrinter);

                 //    if (!isSuccess)
                 //    {
                 //        MainApp.ShowSnackbar("In lỗi!", AlertType.Error);
                 //        return;
                 //    }

                 //    MainApp.CurrentPrintJob = data;

                 //    var task = new CustomAsyncTask(this, this.BindingReceiptData(data), () =>
                 //    {
                 //        printerDisconnectHandler.PostDelayed(DisConnectPrinter, PRINTER_DISCONNECT_TIMEOUT);
                 //        DroidUtility.ExecJavaScript(_mainWebView.WebView, "reprintOrderConfirm()");
                 //    });

                 //    task.Execute();

                 //});
             };

            _javascriptClient.MobileLoginCallback = (loginName, passCode) =>
            {
                _sessionLoginName = loginName;
                _sessionPassCode = passCode;
            };

            _javascriptClient.RememberPassCheckingCallback = () =>
            {
                if (!BaseModelHelper.Instance.SecureStorage.Exist(Constants.SECURE_LOGIN_NAME) || !BaseModelHelper.Instance.SecureStorage.Exist(Constants.SECURE_PASSCODE))
                {
                    //check
                    DroidUtility.ExecJavaScript(_mainWebView.WebView, "rememberPassConfirm()");
                    return;
                }

                if (BaseModelHelper.Instance.SecureStorage.Fetch(Constants.SECURE_LOGIN_NAME) != (_sessionLoginName))
                {
                    //check
                    DroidUtility.ExecJavaScript(_mainWebView.WebView, "rememberPassConfirm()");
                    return;
                }
            };

            _javascriptClient.PasscodeClearingCallback = () =>
            {
                BaseModelHelper.Instance.SecureStorage.Remove(Constants.SECURE_LOGIN_NAME);
                BaseModelHelper.Instance.SecureStorage.Remove(Constants.SECURE_PASSCODE);
            };

            _javascriptClient.PasscodeSavingCallback = () =>
            {
                BaseModelHelper.Instance.SecureStorage.Store(Constants.SECURE_LOGIN_NAME, _sessionLoginName);
                BaseModelHelper.Instance.SecureStorage.Store(Constants.SECURE_PASSCODE, _sessionPassCode);
            };

            _javascriptClient.SavedLoginInforGettingRequesCallback = () =>
            {
                var password = BaseModelHelper.Instance.SecureStorage.Fetch(Constants.SECURE_PASSCODE);
                var loginName = BaseModelHelper.Instance.SecureStorage.Fetch(Constants.SECURE_LOGIN_NAME);

                if (string.IsNullOrEmpty(loginName))
                    return;

                DroidUtility.ExecJavaScript(_mainWebView.WebView, "savedLoginInforReturn(\"" + loginName + "\",\"" + password + "\")");

            };

            webView.AddJavascriptInterface(_javascriptClient, "Android");
        }

        void DisConnectPrinter()
        {
            MainApp.DisconnectToBluetoothDevice();
        }

        protected override void InitView(ViewGroup viewGroup)
        {
            _mainWebView = FindViewById<WebViewSuite>(Resource.Id.mainWebview);
            _mask = FindViewById<View>(Resource.Id.mask);

            _mainWebView.ToggleProgressbar(false);
            _mainWebView.InterfereWebViewSetup(this);

#if DEBUG
            WebView.SetWebContentsDebuggingEnabled(true);
#endif

            SetStatusBarColor(true);

            _mainWebView.StartLoading(BaseModelHelper.Instance.RootWebUrl);


            //if (ContextCompat.CheckSelfPermission(this, Manifest.Permission.AccessFineLocation) != Android.Content.PM.Permission.Granted)
            //{
            //    ActivityCompat.RequestPermissions(this, new string[] { Manifest.Permission.AccessFineLocation }, 999);
            //}
            //else
            //{
            //    _mainWebView.StartLoading("https://florid-app.herokuapp.com");
            //}
        }

        //public override void OnRequestPermissionsResult(int requestCode, string[] permissions, [GeneratedEnum] Permission[] grantResults)
        //{
        //    Xamarin.Essentials.Platform.OnRequestPermissionsResult(requestCode, permissions, grantResults);

        //    base.OnRequestPermissionsResult(requestCode, permissions, grantResults);

        //    if (grantResults.Length > 0 && grantResults[0] == Permission.Granted)
        //    {
        //        if (requestCode == 999)
        //        {
        //            _mainWebView.StartLoading("https://florid-app.herokuapp.com");
        //        }
        //    }

        //}

        //CancellationTokenSource cts;

        //protected override async void OnResume()
        //{
        //    base.OnResume();

        //    //try
        //    //{

        //    //    var request = new GeolocationRequest(GeolocationAccuracy.Best, TimeSpan.FromSeconds(10));
        //    //    cts = new CancellationTokenSource();
         


        //    //    if (location != null)
        //    //    {
        //    //        Console.WriteLine($"Latitude: {location.Latitude}, Longitude: {location.Longitude}, Altitude: {location.Altitude}");

        //    //        var acc = location.Accuracy;

        //    //        var placemarks = await Geocoding.GetPlacemarksAsync(location);

        //    //        if (location.IsFromMockProvider)
        //    //        {
        //    //            Console.WriteLine("is mock");
        //    //        }
        //    //        else
        //    //            Console.WriteLine("not mock");

        //    //        var placemark = placemarks?.FirstOrDefault();
        //    //        if (placemark != null)
        //    //        {
        //    //            var geocodeAddress =
        //    //                $"AdminArea:       {placemark.AdminArea}\n" +
        //    //                $"CountryCode:     {placemark.CountryCode}\n" +
        //    //                $"CountryName:     {placemark.CountryName}\n" +
        //    //                $"FeatureName:     {placemark.FeatureName}\n" +
        //    //                $"Locality:        {placemark.Locality}\n" +
        //    //                $"PostalCode:      {placemark.PostalCode}\n" +
        //    //                $"SubAdminArea:    {placemark.SubAdminArea}\n" +
        //    //                $"SubLocality:     {placemark.SubLocality}\n" +
        //    //                $"SubThoroughfare: {placemark.SubThoroughfare}\n" +
        //    //                $"Thoroughfare:    {placemark.Thoroughfare}\n"+
        //    //                $"Accuracy:    {acc}\n";

        //    //            Console.WriteLine(geocodeAddress);
        //    //        }
        //    //    }
        //    //}
        //    //catch (FeatureNotSupportedException fnsEx)
        //    //{
        //    //    // Handle not supported on device exception
        //    //}
        //    //catch (FeatureNotEnabledException fneEx)
        //    //{
        //    //    // Handle not enabled on device exception
        //    //}
        //    //catch (PermissionException pEx)
        //    //{
        //    //    // Handle permission exception
        //    //}
        //    //catch (Exception ex)
        //    //{
        //    //    // Unable to get location
        //    //}
        //}


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

        public override void ShareImage(string img, string contactInfo)
        {
            var clipBoard = this.GetSystemService(Context.ClipboardService).JavaCast<ClipboardManager>();
            var clip = ClipData.NewPlainText("tel", contactInfo);
            clipBoard.PrimaryClip = clip;

            img = img.Replace("data:image/png;base64,", "").Replace("data:image/jpeg;base64,", "");

            byte[] decodedString = Base64.GetDecoder().Decode(img);

            using (Bitmap decodedByte = BitmapFactory.DecodeByteArray(decodedString, 0, decodedString.Length))
            {
                var newImg = CreateNewFilePath(".png");

                Log.Debug("URL", newImg.AbsolutePath);

                using (var stream = new FileStream(newImg.AbsolutePath, FileMode.Create))
                {
                    decodedByte.Compress(Bitmap.CompressFormat.Png, 1, stream);

                    ShareImgFile(newImg.AbsolutePath);
                }

            }
        }

        public override void ShareImage(string contactInfo)
        {
            var clipBoard = this.GetSystemService(Context.ClipboardService).JavaCast<ClipboardManager>();
            var clip = ClipData.NewPlainText("tel", contactInfo);
            clipBoard.PrimaryClip = clip;

            ShareImgFile(_savedFileUrl);
        }

        void ShareImgFile(string filePath)
        {
            Intent share = new Intent(Intent.ActionSend);
            share.SetType(filePath.Contains(".png") ? "image/png" : "image/jpeg");

            var photoFile = new Java.IO.File(filePath);

            _newSharingImgPath = filePath;

            if (Build.VERSION.SdkInt >= BuildVersionCodes.N)
            {
                Uri photoURI = FileProvider.GetUriForFile(this,
                                              "com.florid.staff.fileprovider",
                                              photoFile);

                share.PutExtra(Intent.ExtraStream, photoURI);

            }
            else

                share.PutExtra(Intent.ExtraStream, Uri.FromFile(photoFile));

            StartActivityForResult(Intent.CreateChooser(share, "Share Image"), REQUEST_SHARING_NEW_IMG);
        }

        public override void ReleaseTempImage()
        {
            if (!string.IsNullOrEmpty(_savedFileUrl))
            {
                File.Delete(_savedFileUrl);
                _savedFileUrl = "";
                Log.Debug("Florid", "Temp image is deleted");
            }
        }

        private string CreateImageFile(string sourceFilePath)
        {
            var ext = sourceFilePath.Contains(".png") ? ".png" : ".jpeg";

            var image = CreateNewFilePath(ext);

            File.Copy(sourceFilePath, image.AbsolutePath);

            return image.AbsolutePath;
        }

        Java.IO.File CreateNewFilePath(string ext)
        {
            var storageDir = GetExternalFilesDir(Android.OS.Environment.DirectoryPictures);

            var imagePath = new Java.IO.File(storageDir, "Florid_images");

            Log.Debug("Florid", imagePath.AbsolutePath);

            if (!imagePath.Exists() && !imagePath.Mkdirs())
            {
                Log.Debug("Florid", "failed to create directory");
            }

            string imageFileName = (System.DateTime.Now).ToString("yyyyMMdd_HHmmss") + ext;
            var image = new Java.IO.File(imagePath, imageFileName);

            return image;
        }

        protected override void OnActivityResult(int requestCode, [GeneratedEnum] Result resultCode, Intent data)
        {
            base.OnActivityResult(requestCode, resultCode, data);

            if (requestCode == REQUEST_SHARING_NEW_IMG)
            {
                if (!string.IsNullOrEmpty(_newSharingImgPath))
                {
                    File.Delete(_newSharingImgPath);
                    Log.Debug("Florid", "New image is deleted");
                }
                return;
            }

            if (resultCode != Result.Ok)
                return;

            MediaFile file;
            string path;
            Java.IO.File sourceFile;

            switch (requestCode)
            {
                case REQUEST_FILE_PICKER_SHARE:

                    if (!string.IsNullOrEmpty(_savedFileUrl))
                    {
                        File.Delete(_savedFileUrl);
                        Log.Debug("Florid", "New image is deleted");
                    }

                    file = (MediaFile)data.GetParcelableArrayListExtra(FilePickerActivity.MediaFiles)[0];
                    path = file.Path;

                    _savedFileUrl = CreateImageFile(path);

                    sourceFile = new Java.IO.File(_savedFileUrl);

                    using (var resizedImage = new Resizer(this)
                       .SetTargetLength(1080)
                       .SetQuality(80)
                       .SetSourceImage(sourceFile)
                       .SetOutputFormat("png")
                       .ResizedBitmap)
                    {
                        using (var stream = new MemoryStream())
                        {
                            resizedImage.Compress(Bitmap.CompressFormat.Png, 1, stream);

                            var bytes = stream.ToArray();

                            var encoded = Base64.GetEncoder().EncodeToString(bytes);

                            DroidUtility.ExecJavaScript(_mainWebView.WebView, "fileChosen(\"" + encoded + "\")");

                        }
                    }
                    break;

                case REQUEST_FILE_PICKER:

                    file = (MediaFile)data.GetParcelableArrayListExtra(FilePickerActivity.MediaFiles)[0];
                    path = file.Path;

                    sourceFile = new Java.IO.File(path);

                    using (var resizedImage = new Resizer(this)
                        .SetTargetLength(1080)
                        .SetQuality(80)
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