using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Firebase.Database;
using Florid.Core.Service;

namespace Florid.Staff.Droid.Services
{
    public class FirebaseDBSession : INormalDBSession<FirebaseClient>
    {
        IList<IDisposable> _registeredHandles;
        FirebaseClient _client;
        string _dbPath;

        public FirebaseClient Client => _client;

        public FirebaseDBSession(string dbPath)
        {
            _dbPath = dbPath;
        }

        public FirebaseDBSession()
        {

        }

        public FirebaseClient Authenticate(string token)
        {
            _registeredHandles = new List<IDisposable>();

            _client = new FirebaseClient(_dbPath, new FirebaseOptions
            {
                AuthTokenAsyncFactory = () => Task.Run<string>(() => {
                    return token;
                })
            });

            return _client;
        }

        public void Logout()
        {
            _registeredHandles.ToList().ForEach(handle => handle.Dispose());
            _registeredHandles.Clear();

            _client = null;

        }

        public void AddHandle(IDisposable handle)
        {
            _registeredHandles.Add(handle);
        }
    }
}