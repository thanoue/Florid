using System;
using System.Collections.Generic;
using Android.Graphics;

namespace Florid.Droid.Common
{
    public class BaseModelHelper
    {
        string TAG = "BaseModelHelper";
        static Lazy<BaseModelHelper> _instance = new Lazy<BaseModelHelper>();
        public static BaseModelHelper Instance => _instance.Value;

        public IDictionary<int, Typeface> CacheFonts = new Dictionary<int, Typeface>();
    }
}
