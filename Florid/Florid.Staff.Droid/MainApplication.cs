using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Florid.Core;
using Florid.Core.Service;
using Florid.Entity;
using Florid.Staff.Droid.Repository;

namespace Florid.Staff.Droid
{
    [Application]
    public class MainApplication : Application
    {
        public MainApplication(IntPtr javaReference, JniHandleOwnership transfer) : base(javaReference, transfer)
        {

        }

        public override void OnCreate()
        {
            base.OnCreate();

            ServiceLocator.Instance.Register<IUserRepository, UserRepository>();
        }
    }
}