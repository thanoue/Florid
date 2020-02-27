using System;
using Android.Content;
using Android.Runtime;
using Android.Util;
using Android.Views.InputMethods;
using Android.Webkit;

namespace Florid.Droid.Lib.Widgets
{
    public class CustomWebView : WebView
    {
        public CustomWebView(Context context) : base(context)
        {
        }

        public CustomWebView(Context context, IAttributeSet attrs) : base(context, attrs)
        {
        }

        public CustomWebView(Context context, IAttributeSet attrs, int defStyleAttr) : base(context, attrs, defStyleAttr)
        {
        }

        public CustomWebView(Context context, IAttributeSet attrs, int defStyleAttr, bool privateBrowsing) : base(context, attrs, defStyleAttr, privateBrowsing)
        {
        }

        public CustomWebView(Context context, IAttributeSet attrs, int defStyleAttr, int defStyleRes) : base(context, attrs, defStyleAttr, defStyleRes)
        {
        }

        protected CustomWebView(IntPtr javaReference, JniHandleOwnership transfer) : base(javaReference, transfer)
        {
        }

        public override IInputConnection OnCreateInputConnection(EditorInfo outAttrs)
        {
            var ic =  base.OnCreateInputConnection(outAttrs);
            outAttrs.InputType = Android.Text.InputTypes.ClassNumber;
            return ic;

        }
    }
}
