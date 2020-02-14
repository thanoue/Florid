using System;
using System.Threading.Tasks;
using Android.Content;
using Florid.Entity;
using Florid.Schema.Model;
using Java.Interop;
using Newtonsoft.Json;

namespace Florid.Droid.Lib.Static
{
    public class JavascriptClient : Java.Lang.Object
    {
        Action<string, string> _login;
        Action<EntityType,string> _insertData;

        public JavascriptClient(Action<string, string> login,Action<EntityType,string> insertData)
        {
            _login = login;
            _insertData = insertData;
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
        [Export("insertWithIdResult")]
        public  string InsertWithIdResult(string data)
        {
            var model = JsonConvert.DeserializeObject<GenericModel<BaseEntity>>(data);
            _insertData(model.ModelType, data);
            return "send from android";
        }

    }
}
