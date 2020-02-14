using System;
using Android.Content;
using Android.Graphics;
using Android.Runtime;
using Android.Util;
using Plugin.Iconize.Android.Controls;

namespace Florid.Droid.Widgets
{
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
            var iconName = _context.Resources.GetString(resID);
            SetIcon(iconName);
        }

        public void SetIcon(string iconName)
        {
            Text = $"{{{@"" + iconName + ""}}}";
        }

        protected virtual void Initialize(IAttributeSet attrs = null)
        {
            if (attrs == null)
                return;

            var styleable = _context.ObtainStyledAttributes(attrs, Resource.Styleable.CustomTextView);

            var icon = styleable.GetString(Resource.Styleable.CustomTextView_fontIcon);

            var isBold = styleable.GetBoolean(Resource.Styleable.CustomTextView_isBold, false);

            try
            {
                if (isBold)
                {
                    SetTypeface(BaseModelHelper.Instance.CacheFonts[Resource.Font.bold], TypefaceStyle.Normal);
                }
                else
                {
                    SetTypeface(BaseModelHelper.Instance.CacheFonts[Resource.Font.regular], TypefaceStyle.Normal);
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
