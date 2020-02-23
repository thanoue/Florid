using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.Graphics;
using Android.OS;
using Android.Runtime;
using Android.Support.V7.App;
using Android.Views;
using Android.Webkit;
using Android.Widget;
using Firebase.Auth;
using Florid.Droid.Lib.Static;
using Java.IO;

namespace Florid.Staff.Droid.Activity
{
    [Activity(Theme = "@style/AppTheme", MainLauncher = true, NoHistory = true)]
    public class SplashActivity : AppCompatActivity
    {
        ImageView _testImage;
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            // Create your application here
            SetContentView(Resource.Layout.SplashLayout);
        }

      

        protected override void OnResume()
        {
            base.OnResume();
            var handler = new Handler();
            handler.PostDelayed(() =>
            {
                if (FirebaseAuth.Instance.CurrentUser != null)
                {
                    RunOnUiThread(() =>
                    {
                        StartActivity(typeof(MainActivity));
                    });
                }
                else
                {
                    RunOnUiThread(() =>
                    {
                        StartActivity(typeof(MainActivity));
                    });
                }
            }, 1000);
        }
    }
}