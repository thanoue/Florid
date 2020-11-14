
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
using Florid.Droid.Lib.Service;

namespace Florid.Droid.Lib
{
    public abstract class BaseMainApplication : Application
    {
        public BaseMainApplication(IntPtr javaReference, JniHandleOwnership transfer) : base(javaReference, transfer)
        {

        }

        public BaseMainApplication()
        {

        }

        public  override void OnCreate()
        {
            base.OnCreate();

            ServiceLocator.Instance.Register<IContext, DroidContext>(this);
            ServiceLocator.Instance.Register<ISecure, DroidSecure>();

            BaseModelHelper.Instance.CacheFonts[Resource.Font.bold] = Android.Support.V4.Content.Res.ResourcesCompat.GetFont(this, Resource.Font.bold);
            BaseModelHelper.Instance.CacheFonts[Resource.Font.extra_light] = Android.Support.V4.Content.Res.ResourcesCompat.GetFont(this, Resource.Font.extra_light);
            BaseModelHelper.Instance.CacheFonts[Resource.Font.light] = Android.Support.V4.Content.Res.ResourcesCompat.GetFont(this, Resource.Font.light);
            BaseModelHelper.Instance.CacheFonts[Resource.Font.light_italic] = Android.Support.V4.Content.Res.ResourcesCompat.GetFont(this, Resource.Font.light_italic);
            BaseModelHelper.Instance.CacheFonts[Resource.Font.regular] = Android.Support.V4.Content.Res.ResourcesCompat.GetFont(this, Resource.Font.regular);
            BaseModelHelper.Instance.CacheFonts[Resource.Font.super_regular] = Android.Support.V4.Content.Res.ResourcesCompat.GetFont(this, Resource.Font.super_regular);
        }
    }
}
