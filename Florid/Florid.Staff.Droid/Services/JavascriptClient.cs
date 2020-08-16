﻿using System;
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
using Florid.Model;
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
        Action<string, string,string> _login;
        WebView _mainWebView;
        BaseActivity _activity;
        Action _documentReady;

        public Action<bool> SetPrimaryDarkStatusBar;
        public Action<ReceiptPrintData> DoPrintJob;
        public Action LogoutCallback;

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
        public void Alert(string message,int type)
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
        public void ShareNewImage(string img,string contactInfo)
        {
            _activity.ShareImage(img,contactInfo);
        }

        [Android.Webkit.JavascriptInterface]
        [Export("requestDateSelecting")]
        public void RequestDateSelecting(int year, int month, int day)
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
        public void RequestDateTimeSelecting(int year, int month, int day, int hour, int minute)
        {
            _activity.RunOnUiThread(() =>
            {
                var datetime = new DateTime(year, month + 1, day, hour, minute, 0, 0);
                var cal = ConvertToCalendar(datetime);

                var dialog = new SingleDateAndTimePickerDialog.Builder(_activity)
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
                           .MinutesStep(5).Build();

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
                           .MinutesStep(5).Build();


                dialog.Display();
            });
        }
    }
}
