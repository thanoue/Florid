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
using Java.Interop;

namespace Florid.Staff.Droid.Activity
{
    [Activity]
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
            _mainWebview.ClearCache(true);

            WebSettings settings = _mainWebview.Settings;
            settings.JavaScriptEnabled = true;
            settings.SetEnableSmoothTransition(true);
            settings.SetSupportZoom(true);

            _mainWebview.SetWebViewClient(new WebViewClient());
            _mainWebview.SetWebChromeClient(new WebChromeClient());

       //     _mainWebview.AddJavascriptInterface(new MyJavascriptInterface(this), "Android");
            _mainWebview.LoadUrl("https://lorid-e9c34.web.app");

            //_loginBtn.Click += _loginBtn_Click;

            FindViewById<Button>(Resource.Id.LoginBtn).Click += _loginBtn_Click;
        }


        public void ExecJavaScript(string jscode)
        {
            if (_mainWebview != null)
            {
                _mainWebview.Post(() =>
                {
                    try
                    {
                        if (Build.VERSION.SdkInt >= BuildVersionCodes.Kitkat)
                        {
                            _mainWebview.EvaluateJavascript(jscode,null);
                        }
                        else
                        {
                            _mainWebview.LoadUrl("javascript:" + jscode);
                        }
                    }
                    catch (Exception e)
                    {
                        // TODO: How to handle exceptions?
                    }
                }
                );
            }
            else
            {
                throw new NullReferenceException("WebView is null!");
            }

        }


        private void _loginBtn_Click(object sender, EventArgs e)
        {
            ExecJavaScript("receiveEvent(\"call from android\")");  
            //_mainWebview.ClearCache(true);
            //_mainWebview.LoadUrl("https://lorid-e9c34.web.app");
        }
    }
}