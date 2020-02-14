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
using Florid.Droid.Lib;
using Florid.Entity;
using Florid.Staff.Droid.Repository;
using Florid.Staff.Droid.Service;
using Plugin.Iconize;

namespace Florid.Staff.Droid
{
    [Application]
    public class MainApplication : BaseMainApplication
    {
        public MainApplication(IntPtr javaReference, JniHandleOwnership transfer) : base(javaReference, transfer)
        {

        }

        public MainApplication()
        {

        }

        public override void OnCreate()
        {
            ServiceLocator.Instance.Register<IContext, DroidContext>(this);

            base.OnCreate();

            ServiceLocator.Instance.Register<IUserRepository, UserRepository>();
        }
    }
}