using Android.App;
using Android.OS;
using Android.Support.V7.App;
using Android.Widget;
using Android.Util;
using Firebase.Iid;
using Firebase.Messaging;
using Android.Gms.Common;
using Firebase.Database;
using Florid.Entity;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Firebase.Database.Query;
using Florid.Core.Service;
using Florid.Core;

namespace Florid.Staff.Droid.Activity   
{
    [Activity(Theme = "@style/AppTheme")]
    public class MainActivity : AppCompatActivity
    {
        static readonly string TAG = "MainActivity";

        internal static readonly string CHANNEL_ID = "my_notification_channel";
        internal static readonly int NOTIFICATION_ID = 100;

        const string TABLE_NAME_USER = "Users"; 

        TextView msgText;
        FirebaseClient firebase;

        IUserRepository _userRepository => ServiceLocator.Instance.Get<IUserRepository>();
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            // Set our view from the "main" layout resource
            SetContentView(Resource.Layout.activity_main);

            if (Intent.Extras != null)
            {
                foreach (var key in Intent.Extras.KeySet())
                {
                    var value = Intent.Extras.GetString(key);
                    Log.Debug(TAG, "Key: {0} Value: {1}", key, value);
                }
            }

            msgText = FindViewById<TextView>(Resource.Id.msgText);


            IsPlayServicesAvailable();

            CreateNotificationChannel();

            var logTokenButton = FindViewById<Button>(Resource.Id.logTokenButton);
            logTokenButton.Click += delegate {
                Log.Debug(TAG, "InstanceID token: " + FirebaseInstanceId.Instance.Token);
            };

            var subscribeButton = FindViewById<Button>(Resource.Id.subscribeButton);
            subscribeButton.Click += delegate {
                FirebaseMessaging.Instance.SubscribeToTopic("news");
                Log.Debug(TAG, "Subscribed to remote notifications");
            };

            firebase = new FirebaseClient("https://lorid-e9c34.firebaseio.com/");



            FindViewById<Button>(Resource.Id.insertUserBtn).Click += async (sender, e) =>
            {
                //await UpdatePerson(1, "newEmail@gmails.com").ContinueWith((res) =>
                //{
                //    RunOnUiThread(() =>
                //    {
                //        Toast.MakeText(this, "Updated!!!", ToastLength.Long).Show();
                //    });
                //});


                //await DeletePerson(1).ContinueWith((res) =>
                //{
                //    RunOnUiThread(() =>
                //    {
                //        Toast.MakeText(this, "Updated!!!", ToastLength.Long).Show();
                //    });
                //});


                await AddUser(new User()
                {
                    AvtUrl = "121212121212",
                    Email = "khoisd@gmail.com",
                    FullName = "Mai Van Ba",
                    PhoneNumber = "029328282",
                    LoginModel = new LoginModel()
                    {
                        Passcode = "123456",
                        UserName = "khoikhaguitar"
                    }
                }).ContinueWith(async (res) =>
                {
                    await AddUser(new User()
                    {
                        AvtUrl = "121212121212",
                        Email = "khoisd@gmail.com",
                        FullName = "Mai Van Ba",
                        PhoneNumber = "029328282",
                        LoginModel = new LoginModel()
                        {
                            Passcode = "123456",
                            UserName = "khoikhaguitar"
                        }
                    }).ContinueWith(async (res2) =>
                    {
                        var users = await GetAllPersons();
                        if (users != null)
                        {
                            RunOnUiThread(() =>
                            {
                                Toast.MakeText(this, users.ToString(), ToastLength.Long).Show();
                            });
                        }
                    });
                });
            };

        }

        //public async Task DeletePerson(string personId)
        //{
        //    var toDeletePerson = (await firebase
        //      .Child(TABLE_NAME_USER)
        //      .OnceAsync<User>()).Where(a => a.Object.Id == personId).FirstOrDefault();
        //    await firebase.Child(TABLE_NAME_USER).Child(toDeletePerson.Key).DeleteAsync();

        //}

        //public async Task UpdatePerson(int personId, string name)
        //{
        //    var toUpdatePerson = (await firebase
        //      .Child(TABLE_NAME_USER)
        //      .OnceAsync<User>()).Where(a => a.Object.Id == personId).FirstOrDefault();
            
        //    toUpdatePerson.Object.FullName = name;
        //    toUpdatePerson.Object.LoginModel = new LoginModel()
        //    {
        //        Passcode = "121231232132323s3",
        //        UserName = "11111"
        //    };

        //    await firebase
        //      .Child(TABLE_NAME_USER)
        //      .Child(toUpdatePerson.Key)
        //      .PutAsync(toUpdatePerson.Object);
        //}

     

        public async Task AddUser(User user)
        {
            await _userRepository.Insert(user);
        }


        public async Task<List<User>> GetAllPersons()
        {

            return await _userRepository.GetAll();
        }



        void CreateNotificationChannel()
        {
            if (Build.VERSION.SdkInt < BuildVersionCodes.O)
            {
               
                return;
            }

            var channel = new NotificationChannel(CHANNEL_ID,
                                                  "FCM Notifications",
                                                  NotificationImportance.Default)
            {

                Description = "Firebase Cloud Messages appear in this channel"
            };

            var notificationManager = (NotificationManager)GetSystemService(Android.Content.Context.NotificationService);
            notificationManager.CreateNotificationChannel(channel);
        }

        public bool IsPlayServicesAvailable()
        {
            int resultCode = GoogleApiAvailability.Instance.IsGooglePlayServicesAvailable(this);
            if (resultCode != ConnectionResult.Success)
            {
                if (GoogleApiAvailability.Instance.IsUserResolvableError(resultCode))
                    msgText.Text = GoogleApiAvailability.Instance.GetErrorString(resultCode);
                else
                {
                    msgText.Text = "This device is not supported";
                    Finish();
                }
                return false;
            }
            else
            {
                msgText.Text = "Google Play Services is available.";
                return true;
            }
        }
    }
}