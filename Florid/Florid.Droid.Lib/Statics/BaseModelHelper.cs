using System;
using System.Collections.Generic;
using Android.Graphics;
using Florid.Core;
using Florid.Core.Service;
using Florid.Entity;

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

        public IReceiptPrintJobRepository ReceiptPrintJobRepo => ServiceLocator.Instance.Get<IReceiptPrintJobRepository>();

        public List<Product> GlobalProducts = new List<Product>();

        //public string RootWebUrl { get; set; } = "https://floridstaff.web.app";
        public string RootWebUrl { get; set; } = "http://192.168.1.16:4200";
    }
}
    