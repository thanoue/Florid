using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Android.App;
using Android.Content;
using Android.Graphics;
using Android.Runtime;
using Android.Webkit;
using Florent37.SingleDateAndTimePickerLib.Dialogs;
using Florid.Droid.Lib;
using Florid.Droid.Lib.Static;
using Florid.Entity;
using Florid.Enum;
using Florid.Staff.Droid.Activity;
using JaiselRahman.FilePickerLib.Activities;
using JaiselRahman.FilePickerLib.Configs;
using Java.Interop;
using Java.Util;
using Newtonsoft.Json;

namespace Florid.Staff.Droid.Services
{
    public class JavascriptClient : Java.Lang.Object
    {
        Action<string, string, string> _login;
        WebView _mainWebView;
        BaseActivity _activity;
        Action _documentReady;

        public Action<bool> SetPrimaryDarkStatusBar;
        public Action<ReceiptPrintData> DoPrintJob;
        public Action LogoutCallback;
        public Action<string, string> MobileLoginCallback;
        public Action RememberPassCheckingCallback;
        public Action PasscodeSavingCallback;
        public Action PasscodeClearingCallback;
        public Action SavedLoginInforGettingRequesCallback;
        public Action<string> OnViewImg;

        public JavascriptClient(BaseActivity activity, WebView webview)
        {
            _activity = activity;
            _mainWebView = webview;
        }

        public JavascriptClient(Action documentReady)
        {
            _documentReady = documentReady;
        }

        [Android.Webkit.JavascriptInterface]
        [Export("doPrintJob")]
        public void doPrintJob(string url)
        {
            var data = JsonConvert.DeserializeObject<ReceiptPrintData>(url);

            DoPrintJob?.Invoke(data);
        }

        [Android.Webkit.JavascriptInterface]
        [Export("doOldPrintJob")]
        public void DoOldPrintJob()
        {
            DoPrintJob?.Invoke(_activity.MainApp.CurrentPrintJob);
        }


        [Android.Webkit.JavascriptInterface]
        [Export("setStatusBarColor")]
        public void SetStatusBarColor(bool isDark)
        {
            _activity.RunOnUiThread(() =>
            {
                SetPrimaryDarkStatusBar(isDark);
            });
        }


        [Android.Webkit.JavascriptInterface]
        [Export("alert")]
        public void Alert(string message, int type)
        {
            _activity.MainApp.ShowSnackbar(message, (AlertType)type);
        }

        [Android.Webkit.JavascriptInterface]
        [Export("pickFile")]
        public void PickFile()
        {

            var intent = new Intent(_activity, typeof(FilePickerActivity));
            intent.PutExtra(FilePickerActivity.Configs, new Configurations.Builder()
                .SetCheckPermission(true)
                .SetShowAudios(false)
                .SetShowImages(true)
                .EnableImageCapture(true)
                .SetMaxSelection(1)
                .SetSkipZeroSizeFiles(true)
                .SetShowVideos(false)
                .Build());

            _activity.StartActivityForResult(intent, MainActivity.REQUEST_FILE_PICKER);
        }

        [Android.Webkit.JavascriptInterface]
        [Export("pickFileForShare")]
        public void PickFileForShare()
        {

            var intent = new Intent(_activity, typeof(FilePickerActivity));
            intent.PutExtra(FilePickerActivity.Configs, new Configurations.Builder()
                .SetCheckPermission(true)
                .SetShowAudios(false)
                .SetShowImages(true)
                .EnableImageCapture(true)
                .SetMaxSelection(1)
                .SetSingleClickSelection(true)
                .SetSkipZeroSizeFiles(true)
                .SetShowVideos(false)
                .Build());

            _activity.StartActivityForResult(intent, MainActivity.REQUEST_FILE_PICKER_SHARE);
        }

        [Android.Webkit.JavascriptInterface]
        [Export("locationDetected")]
        public void LocationDetected(string location)
        {
            Console.WriteLine(location);
        }


        [Android.Webkit.JavascriptInterface]
        [Export("viewImage")]
        public void ViewImage(string url)
        {
            OnViewImg?.Invoke(url);
        }

        [Android.Webkit.JavascriptInterface]
        [Export("releaseTempImage")]
        public void ReleaseTempImage()
        {
            _activity.ReleaseTempImage();
        }

        [Android.Webkit.JavascriptInterface]
        [Export("shareImage")]
        public void ShareImage(string contactInfo)
        {
            _activity.ShareImage(contactInfo);
        }

        [Android.Webkit.JavascriptInterface]
        [Export("shareNewImage")]
        public void ShareNewImage(string img, string contactInfo)
        {
            _activity.ShareImage(img, contactInfo);
        }

        [Android.Webkit.JavascriptInterface]
        [Export("mobileLogin")]
        public void MobileLogin(string loginName, string passcode)
        {
            MobileLoginCallback?.Invoke(loginName, passcode);
        }

        [Android.Webkit.JavascriptInterface]
        [Export("isRememberPassChecking")]
        public void IsRememberPassChecking()
        {
            RememberPassCheckingCallback?.Invoke();
        }

        [Android.Webkit.JavascriptInterface]
        [Export("passwordSaving")]
        public void PasswordSaving()
        {
            PasscodeSavingCallback?.Invoke();
        }

        [Android.Webkit.JavascriptInterface]
        [Export("passwordClearing")]
        public void PasswordClearing()
        {
            PasscodeClearingCallback?.Invoke();
        }

        [Android.Webkit.JavascriptInterface]
        [Export("savedLoginInforGettingRequest")]
        public void SavedLoginInforGettingRequest()
        {
            SavedLoginInforGettingRequesCallback?.Invoke();
        }

    }
}
