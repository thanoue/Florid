using System;
using Android.Content;
using Android.Graphics;
using Android.Runtime;
using Android.Util;
using Florid.Droid.Lib;
using Plugin.Iconize.Android.Controls;

namespace Florid.Droid.Widgets
{
    public enum CustomFonts
    {
        Regular,
        ExtraLight,
        Light,
        LightItalic,
        SuperRegular,
        Bold
    }

    public class CustomTextView : IconTextView
    {
        public const string TAG = nameof(CustomTextView);
        protected Context _context;

        public CustomTextView(IntPtr intPtr, JniHandleOwnership jniHandleOwnership) : base(intPtr, jniHandleOwnership)
        {

        }

        public CustomTextView(Context context) :
            base(context)
        {
            _context = context;
            Initialize();
        }

        public CustomTextView(Context context, IAttributeSet attrs) :
            base(context, attrs)
        {
            _context = context;
            Initialize(attrs);
        }

        public CustomTextView(Context context, IAttributeSet attrs, int defStyle) :
            base(context, attrs, defStyle)
        {
            _context = context;
            Initialize(attrs);
        }

        public void SetIcon(int resID)
        {
            var iconName = BaseModelHelper.Instance.Context.GetStringFromResource(resID);
            SetIcon(iconName);
        }

        public void SetIcon(string iconName)
        {
            Text = $"{{{@"" + iconName + ""}}}";
        }

        public void SetCustomFont(CustomFonts customFonts)
        {
            switch (customFonts)
            {
                case CustomFonts.Regular:
                    SetTypeface(BaseModelHelper.Instance.CacheFonts[Resource.Font.regular], TypefaceStyle.Normal);
                    break;
                case CustomFonts.Bold:
                    SetTypeface(BaseModelHelper.Instance.CacheFonts[Resource.Font.bold], TypefaceStyle.Normal);
                    break;
                case CustomFonts.Light:
                    SetTypeface(BaseModelHelper.Instance.CacheFonts[Resource.Font.light], TypefaceStyle.Normal);
                    break;
                case CustomFonts.ExtraLight:
                    SetTypeface(BaseModelHelper.Instance.CacheFonts[Resource.Font.extra_light], TypefaceStyle.Normal);
                    break;
                case CustomFonts.LightItalic:
                    SetTypeface(BaseModelHelper.Instance.CacheFonts[Resource.Font.light_italic], TypefaceStyle.Normal);
                    break;
                case CustomFonts.SuperRegular:
                    SetTypeface(BaseModelHelper.Instance.CacheFonts[Resource.Font.super_regular], TypefaceStyle.Normal);
                    break;
            }
        }

        protected virtual void Initialize(IAttributeSet attrs = null)
        {
            if (attrs == null)
                return;

            var styleable = _context.ObtainStyledAttributes(attrs, Resource.Styleable.CustomTextView);

            var icon = styleable.GetString(Resource.Styleable.CustomTextView_fontIcon);

            var isBold = styleable.GetBoolean(Resource.Styleable.CustomTextView_isBold, false);

            var customFont = (CustomFonts)styleable.GetInt(Resource.Styleable.CustomTextView_customFont, 0);

            try
            {
                if (isBold)
                {
                    SetTypeface(BaseModelHelper.Instance.CacheFonts[Resource.Font.bold], TypefaceStyle.Normal);
                }
                else
                {
                    SetCustomFont(customFont);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            if (!string.IsNullOrEmpty(icon))
            {
                SetIcon(icon);
            }
        }
    }
}
