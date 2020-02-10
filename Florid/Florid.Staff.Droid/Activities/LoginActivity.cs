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
using Firebase.Auth;

namespace Florid.Staff.Droid.Activities
{
    [Activity(Label = "LoginActivity", Theme = "@style/AppTheme")]
    public class LoginActivity : AppCompatActivity
    {
        Button _loginBtn;
        EditText _phoneNumberTxt, _passwordTxt;
        FirebaseAuth _auth;
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            // Create your application here
            SetContentView(Resource.Layout.LoginLayout);

            _loginBtn = FindViewById<Button>(Resource.Id.LoginBtn);
            _phoneNumberTxt = FindViewById<EditText>(Resource.Id.phoneNumber);
            _passwordTxt = FindViewById<EditText>(Resource.Id.password);

            _loginBtn.Click += _loginBtn_Click;

            _auth = FirebaseAuth.Instance;
        }

        private void _loginBtn_Click(object sender, EventArgs e)
        {
            _auth.sign
        }
    }
}