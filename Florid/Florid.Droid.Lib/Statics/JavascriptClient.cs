﻿using System;
using System.Threading.Tasks;
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

        [Android.Webkit.JavascriptInterface]
        [Export("getFirebaseConfig")]
        public  string GetFirebaseConfig()
        {
            var config = new FirebaseConfig()
            {
                ApiKey = "AIzaSyDZGFKjLZH4h0SCRdmJVAP0QsRxo_9qYwA",
                AuthDomain = "lorid-e9c34.firebaseapp.com",
                DatabaseURL = "https://lorid-e9c34.firebaseio.com",
                ProjectId = "lorid-e9c34",
                StorageBucket = "lorid-e9c34.appspot.com",
                MessagingSenderId = "messagingSenderId",
                AppId = "1:907493762076:web:41a83454c12029c3c6abd9",
                MeasurementId = "G-DMM406R71M"
            };

            return JsonConvert.SerializeObject(config); 
        }


    }
}
