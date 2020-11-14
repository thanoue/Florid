    
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

        public virtual void ShareImage(string contactInfo)
        {

        }

        public virtual void ReleaseTempImage()
        {

        }

        public virtual void ShareImage(string img,string contactInfo)
        {

        }

        protected bool IsLoggedIn()
        {
            return false;
        }

        protected abstract void InitView(ViewGroup viewGroup);
    }
}
