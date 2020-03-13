using System;
using System.Threading.Tasks;
using Android.App;
using Android.Content;
using Android.Graphics;
using Android.Runtime;
using Android.Webkit;
using Florent37.SingleDateAndTimePickerLib.Dialogs;
using Florid.Droid.Lib;
using Florid.Entity;
using Florid.Model;
using Florid.Staff.Droid.Activity;
using Java.Interop;
using Java.Util;
using Newtonsoft.Json;

namespace Florid.Staff.Droid.Services
{
    public class JavascriptClient : Java.Lang.Object
    {
        Action<string, string> _login;
        WebView _mainWebView;
        MainActivity _activity;
        Action _documentReady;

        public Action<bool> SetPrimaryDarkStatusBar;
        public Action<string> DoPrintJob;

        public JavascriptClient(MainActivity activity, WebView webview, Action<string, string> login)
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
        public void Login(string email, string password)
        {
            _login(email, password);
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
        [Export("getFirebaseConfig")]
        public string GetFirebaseConfig()
        {
            var config = BaseModelHelper.Instance.SecureConfig.GetFirebaseConfig();

            return JsonConvert.SerializeObject(config);
        }

        [Android.Webkit.JavascriptInterface]
        [Export("requestDateSelecting")]
        public void RequestDateSelecting(int year, int month, int day)
        {
            _activity.RunOnUiThread(() =>
            {
                _activity.ShowMask();

                var dialog = new DateTimePickerDialog(_activity, () =>
                {
                    _activity.DismissMask();
                })
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
        public void RequestDateTimeSelecting(int year, int month, int day, int hour, int minute)
        {
            _activity.RunOnUiThread(() =>
            {
                var datetime = new DateTime(year, month + 1, day, hour, minute, 0, 0);
                var cal = ConvertToCalendar(datetime);

                _activity.ShowMask();

                var dialog = new DateTimePickerDialog(_activity, () =>
                {
                    _activity.DismissMask();
                })
               .Title("DateTime Chooosing")
               .DefaultDate(cal.Time)
               .Listener(new DatetimePickerCallback(_mainWebView, DialogStyle.DateTime))
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

        public static Calendar ConvertToCalendar(DateTime date)
        {
            Calendar calendar = Calendar.Instance;
            calendar.Set(date.Year, date.Month - 1, date.Day, date.Hour, date.Minute, date.Second);
            return calendar;
        }

        [Android.Webkit.JavascriptInterface]
        [Export("requestTimeSelecting")]
        public void RequestTimeSelecting(int hour, int minute)
        {
            _activity.RunOnUiThread(() =>
            {
               // _activity.ShowMask();
                var dialog = new DateTimePickerDialog(_activity, () =>
                              {
                                  _activity.DismissMask();
                              })
                           .Title("Time Chooosing")
                           .Listener(new DatetimePickerCallback(_mainWebView, DialogStyle.Time))
                           .TitleTextColor(Color.White)
                           .MainColor(_activity.Resources.GetColor(Resource.Color.colorPrimary))
                           .DisplayHours(true)
                           .DisplayMinutes(true)
                           .DisplayAmPm(true)
                           .Curved()
                           .CustomLocale(new Locale("vi"))
                           .MinutesStep(5).Build();


                dialog.Display();
            });
        }

        public class DateTimePickerDialog : SingleDateAndTimePickerDialog.Builder
        {
            private Action _onDismiss;
            protected DateTimePickerDialog(IntPtr javaReference, JniHandleOwnership transfer) : base(javaReference, transfer)
            {
            }

            public DateTimePickerDialog(Context context, Action onDismiss) : base(context)
            {
                _onDismiss = onDismiss;
            }

            public override void Dismiss()
            {
                base.Dismiss();
                _onDismiss?.Invoke();
            }
        }

    }
}
