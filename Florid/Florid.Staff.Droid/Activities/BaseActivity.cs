    
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
    [Activity(Theme = "@style/AppTheme")]
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

        private RelativeLayout _baseLayout;
        private ViewGroup _mainContent;
        private CustomTextView _backBtn;
        private CustomTextView _titleTv;

        protected override void OnCreate(Bundle savedInstanceState)
        {
            Window.SetFlags(WindowManagerFlags.LayoutNoLimits,
                 WindowManagerFlags.LayoutNoLimits);

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
                SetContentView(_mainContent);
            }

            InitView(_mainContent);

            // Create your application here
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
