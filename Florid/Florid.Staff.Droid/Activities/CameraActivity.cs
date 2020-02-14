
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

namespace Florid.Staff.Droid.Activity
{
    [Activity]
    public class CameraActivity : BaseActivity
    {
        protected override int LayoutId => Resource.Layout.TakePictureLayout;

        protected override void InitView(ViewGroup viewGroup)
        {

        }

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

        }
    }
}
