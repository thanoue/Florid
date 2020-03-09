using System;
using System.Threading.Tasks;
using Android.App;
using Android.Content;
using Android.Graphics;
using Android.Webkit;
using Florent37.SingleDateAndTimePickerLib.Dialogs;
using Florid.Entity;
using Florid.Model;
using Java.Interop;
using Java.Util;
using Newtonsoft.Json;

namespace Florid.Droid.Lib.Static
{
    public class JavascriptClient : Java.Lang.Object
    {
        Action<string, string> _login;
        WebView _mainWebView;
        Activity _activity;
        Action _documentReady;

        public Action<bool> SetPrimaryDarkStatusBar;
        public Action<string> DoPrintJob;
        public Action<int,int,int> RequestDatePicker;
        public Action<int,int> RequestTimePicker;
        public Action<int,int,int,int,int> RequestDateTimePicker;
     
        public JavascriptClient(Activity activity,WebView webview,Action<string, string> login)
        {
            _login = login;
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
            DoPrintJob?.Invoke(url);
        }

        [Android.Webkit.JavascriptInterface]
        [Export("documentReady")]
        public void DocumentReady()
        {
            _documentReady();
        }

        [Android.Webkit.JavascriptInterface]
        [Export("login")]
        public void Login(string email,string password)
        {
            _login(email, password);
        }


        [Android.Webkit.JavascriptInterface]
        [Export("setStatusBarColor")]
        public  void SetStatusBarColor(bool isDark)
        {
            _activity.RunOnUiThread(() =>
            {
                SetPrimaryDarkStatusBar(isDark);
            });
        }


        [Android.Webkit.JavascriptInterface]
        [Export("getFirebaseConfig")]
        public  string GetFirebaseConfig()
        {
            var config = BaseModelHelper.Instance.SecureConfig.GetFirebaseConfig();

            return JsonConvert.SerializeObject(config); 
        }

        [Android.Webkit.JavascriptInterface]
        [Export("requestDateSelecting")]
        public  void RequestDateSelecting(int year, int month, int day)
        {
            _activity.RunOnUiThread(() =>
            {
                var dialog = new SingleDateAndTimePickerDialog.Builder(_activity)
                               .Title("Date Chooosing")
                               .Listener(new DatetimePickerCallback(_mainWebView, DialogStyle.Date))
                               .TitleTextColor(Color.White)
                               .MainColor(_activity.Resources.GetColor(Resource.Color.colorPrimary))
                               .DisplayHours(false)
                               .DisplayMinutes(false)
                               .DisplayDays(false)
                               .DisplayYears(true)
                               .DisplayMonth(true)
                               .DisplayDaysOfMonth(true)
                               .Curved()
                               .CustomLocale(new Locale("vi"));


                dialog.Display();
            });
        }

        [Android.Webkit.JavascriptInterface]
        [Export("requestDateTimeSelecting")]
        public  void RequestDateTimeSelecting(int year, int month, int day,int hour, int minute)
        {
            _activity.RunOnUiThread(() =>
            {
                var dialog = new SingleDateAndTimePickerDialog.Builder(_activity)
                           .Title("DateTime Chooosing")
                           .Listener(new DatetimePickerCallback(_mainWebView, DialogStyle.DateTime))
                           .TitleTextColor(Color.White)
                           .MainColor(_activity.Resources.GetColor(Resource.Color.colorPrimary))
                           .DisplayHours(true)
                           .DisplayMinutes(true)
                           .DisplayAmPm(true)
                           .DisplayDays(true)
                           .DisplayYears(true)
                           .DisplayMonth(true)
                           .DisplayDaysOfMonth(true)
                           .Curved()
                           .CustomLocale(new Locale("vi"))
                           .MinutesStep(5);
               
                dialog.Display();
            });
        }

        [Android.Webkit.JavascriptInterface]
        [Export("requestTimeSelecting")]
        public void RequestTimeSelecting(int hour, int minute)
        {
            _activity.RunOnUiThread(() =>
            {
                var dialog = new SingleDateAndTimePickerDialog.Builder(_activity)
                           .Title("Time Chooosing")
                           .Listener(new DatetimePickerCallback(_mainWebView, DialogStyle.Time))
                           .TitleTextColor(Color.White)
                           .MainColor(_activity.Resources.GetColor(Resource.Color.colorPrimary))
                           .DisplayHours(true)
                           .DisplayMinutes(true)
                           .DisplayAmPm(true)
                           .Curved()
                           .CustomLocale(new Locale("vi"))
                           .MinutesStep(5);


                dialog.Display();
            });
        }


    }
}
