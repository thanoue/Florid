    
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Support.V7.App;
using Android.Views;
using Android.Widget;
using Florid.Droid.Widgets;

namespace Florid.Staff.Droid.Activity
{
    [Activity(Theme = "@style/AppTheme",WindowSoftInputMode = SoftInput.AdjustResize)]
    public abstract class BaseActivity : AppCompatActivity
    {
        protected virtual int LayoutId => 0;
        protected virtual bool ShowBackButton  => false;
        protected virtual bool UseOwnLayout => false;
        protected virtual new string Title => "Base Activity";


        protected virtual void OnBacktbnClicking()
        {
            Finish();
        }

        private ViewGroup _baseLayout;
        private ViewGroup _mainContent;
        private CustomTextView _backBtn;
        private CustomTextView _titleTv;

        public ViewGroup ParentContainer
        {
            get => _baseLayout;
        }

        public MainApplication MainApp => (MainApplication)Application;

        protected override void OnCreate(Bundle savedInstanceState)
        {

            if (Build.VERSION.SdkInt > BuildVersionCodes.Lollipop)
            {
                Window.ClearFlags(Android.Views.WindowManagerFlags.TranslucentNavigation);
                Window.ClearFlags(Android.Views.WindowManagerFlags.TranslucentStatus);
                Window.AddFlags(Android.Views.WindowManagerFlags.DrawsSystemBarBackgrounds);
                Window.SetStatusBarColor(Resources.GetColor(Resource.Color.colorPrimary));
                Window.SetNavigationBarColor(Resources.GetColor(Resource.Color.colorPrimary));
            }

            base.OnCreate(savedInstanceState);

            if (!UseOwnLayout)
            {
                _baseLayout = (RelativeLayout)LayoutInflater.Inflate(Resource.Layout.BaseLayout, null, false);

                _mainContent = (ViewGroup)LayoutInflater.Inflate(LayoutId, _baseLayout, true);

                SetContentView(_baseLayout);

                _backBtn = FindViewById<CustomTextView>(Resource.Id.backBtn);
                _titleTv = FindViewById<CustomTextView>(Resource.Id.title);

                _backBtn.Click += delegate
                {
                    OnBacktbnClicking();
                };

                SetTitle(Title);

                if (!ShowBackButton)
                {
                    _backBtn.Visibility = ViewStates.Gone;
                }
            }
            else
            {
                _mainContent = (ViewGroup)LayoutInflater.Inflate(LayoutId, null, true);
                _baseLayout = _mainContent;
                SetContentView(_mainContent);
            }

            InitView(_mainContent);

            // Create your application here
        }

        public void SetStatusBarColor(bool isDark)
        {
            if (isDark)
            {
                Window.SetStatusBarColor(Resources.GetColor(Resource.Color.mainBackground));
                Window.SetNavigationBarColor(Resources.GetColor(Resource.Color.mainBackground));
            }
            else
            {
                Window.SetStatusBarColor(Resources.GetColor(Resource.Color.colorPrimary));
                Window.SetNavigationBarColor(Resources.GetColor(Resource.Color.colorPrimary));
            }
        }

        protected void SetTitle(string title)
        {
            _titleTv.Text = title;
        }

        protected void SetBackBtnIcon(int resId)
        {
            _backBtn.SetIcon(resId);
        }

        protected abstract void InitView(ViewGroup viewGroup);
    }
}
