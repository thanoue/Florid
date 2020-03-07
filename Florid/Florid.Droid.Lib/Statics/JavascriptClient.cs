using System;
using System.Threading.Tasks;
using Android.App;
using Android.Content;
using Florid.Entity;
using Florid.Model;
using Java.Interop;
using Newtonsoft.Json;

namespace Florid.Droid.Lib.Static
{
    public class JavascriptClient : Java.Lang.Object
    {
        Action<string, string> _login;
        Action<EntityType,string> _insertData;
        public Action<bool> SetPrimaryDarkStatusBar;
        public Action<string> DoPrintJob;
        public Action<Action<string>> RequestInputDialog; 
        Activity _activity;
        Action _documentReady;
        
        public JavascriptClient(Activity activity,Action<string, string> login,Action<EntityType,string> insertData)
        {
            _login = login;
            _insertData = insertData;
            _activity = activity;
        }

        public JavascriptClient(Action documentReady)
        {
            _documentReady = documentReady;
        }



        [Android.Webkit.JavascriptInterface]
        [Export("doPrintJob")]
        public void doPrintJob(string url)
        {
            DoPrintJob?.Invoke(url);
        }

        [Android.Webkit.JavascriptInterface]
        [Export("documentReady")]
        public void DocumentReady()
        {
            _documentReady();
        }

        [Android.Webkit.JavascriptInterface]
        [Export("login")]
        public void Login(string email,string password)
        {
            _login(email, password);
        }

        [Android.Webkit.JavascriptInterface]
        [Export("insertData")]  
        public void  InsertData(string data)
        {
            var model = JsonConvert.DeserializeObject<GenericModel<BaseEntity>>(data);
            _insertData(model.ModelType,data);
        }


        [Android.Webkit.JavascriptInterface]
        [Export("setStatusBarColor")]
        public  void SetStatusBarColor(bool isDark)
        {
            _activity.RunOnUiThread(() =>
            {
                SetPrimaryDarkStatusBar(isDark);
            });
        }

        [Android.Webkit.JavascriptInterface]
        [Export("insertWithIdResult")]
        public  string InsertWithIdResult(string data)
        {
            var model = JsonConvert.DeserializeObject<GenericModel<BaseEntity>>(data);
            _insertData(model.ModelType, data);
            return "send from android";
        }


        [Android.Webkit.JavascriptInterface]
        [Export("getFirebaseConfig")]
        public  string GetFirebaseConfig()
        {
            var config = BaseModelHelper.Instance.SecureConfig.GetFirebaseConfig();

            return JsonConvert.SerializeObject(config); 
        }

        //[Android.Webkit.JavascriptInterface]
        //[Export("getInput")]
        //public  void GetInput(Action<string> resCallback)
        //{
        //    RequestInputDialog?.Invoke(resCallback);
        //}


    }
}
