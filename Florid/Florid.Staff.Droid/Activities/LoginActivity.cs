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
using Android.Webkit;
using Android.Widget;
using Firebase.Auth;

namespace Florid.Staff.Droid.Activity
{
    [Activity(Label = "LoginActivity", Theme = "@style/AppTheme")]
    public class LoginActivity : AppCompatActivity
    {
        Button _loginBtn;
        EditText _phoneNumberTxt, _passwordTxt;
        FirebaseAuth _auth;
        WebView _mainWebview;
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            // Create your application here
            SetContentView(Resource.Layout.LoginLayout);


            _mainWebview = FindViewById<WebView>(Resource.Id.mainWebview);

            WebSettings settings = _mainWebview.Settings;
            settings.JavaScriptEnabled = true;
            _mainWebview.AddJavascriptInterface(new MyJavascriptInterface(this), "MyJSClient");
            _mainWebview.LoadUrl("https://lorid-e9c34.firebaseapp.com/");
            //_loginBtn.Click += _loginBtn_Click;
        }

        public class MyJavascriptInterface : Java.Lang.Object
        {

            Context context;

            public MyJavascriptInterface(Context context)
            {
                this.context = context;
            }

            [Android.Webkit.JavascriptInterface]
            public void getStringFromJS(String txtVal)
            {
                Toast.MakeText(context, "Value From JS : " + txtVal,ToastLength.Long).Show();
            }

        }

        private void _loginBtn_Click(object sender, EventArgs e)
        {

        }
    }
}