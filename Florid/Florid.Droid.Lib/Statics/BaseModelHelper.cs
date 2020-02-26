using System;
using System.Collections.Generic;
using Android.Graphics;
using Florid.Core;
using Florid.Core.Service;

namespace Florid.Droid.Lib
{
    public class BaseModelHelper
    {
        string TAG = "BaseModelHelper";
        static Lazy<BaseModelHelper> _instance = new Lazy<BaseModelHelper>();
        public static BaseModelHelper Instance => _instance.Value;

        public IDictionary<int, Typeface> CacheFonts = new Dictionary<int, Typeface>();

        public IContext Context => ServiceLocator.Instance.Get<IContext>();

        public ISecureConfig SecureConfig => ServiceLocator.Instance.Get<ISecureConfig>();
    }
}
