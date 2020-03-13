using System;
using Android.Webkit;
using Florent37.SingleDateAndTimePickerLib.Dialogs;
using Florid.Staff.Droid;
using Java.Util;

namespace Florid.Droid.Lib
{
    public class DatetimePickerCallback : Java.Lang.Object, SingleDateAndTimePickerDialog.IListener
    {
        WebView _webView;
        DialogStyle _style;
        Action<Calendar> _dateTimeSetted;

        public DatetimePickerCallback(WebView webView, DialogStyle style, Action<Calendar> dateTimeSetted = null)
        {
            _style = style;
            _webView = webView;
            _dateTimeSetted = dateTimeSetted;
        }

        public void OnDateSelected(Date date)
        {
            var calendar = Calendar.Instance;
            calendar.Time = date;
            _dateTimeSetted?.Invoke(calendar);
            switch (_style)
            {
                case DialogStyle.Date:
                    DroidUtility.ExecJavaScript(_webView, "setDate(" + calendar.Get(CalendarField.Year) + "," + calendar.Get(CalendarField.Month) + "," + calendar.Get(CalendarField.Date) + ");");
                    break;
                case DialogStyle.DateTime:
                    DroidUtility.ExecJavaScript(_webView, "setDateTime(" + calendar.Get(CalendarField.Year) + "," + calendar.Get(CalendarField.Month) + "," + calendar.Get(CalendarField.Date) + "," + calendar.Get(CalendarField.HourOfDay) +"," + calendar.Get(CalendarField.Minute) + ");");
                    break;
                case DialogStyle.Time:
                    DroidUtility.ExecJavaScript(_webView, "setTime(" + calendar.Get(CalendarField.HourOfDay) + "," + calendar.Get(CalendarField.Minute) +");");
                    break;
            }

        }

    }
}
