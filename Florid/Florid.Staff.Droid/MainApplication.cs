﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using Android.App;
using Android.Content;
using Android.Graphics;
using Android.OS;
using Android.Runtime;
using Android.Support.Design.Widget;
using Android.Support.V7.App;
using Android.Util;
using Android.Views;
using Android.Widget;
using Com.Khoideptrai.Posprinter;
using Firebase.Database;
using Firebase.Storage;
using Florid.Core;
using Florid.Core.Service;
using Florid.Droid.Lib;
using Florid.Entity;
using Florid.Staff.Droid.Activity;
using Florid.Staff.Droid.Repository;
using Florid.Staff.Droid.Services;
using Florid.Staff.Droid.Static;
using Java.Lang;
using Net.Posprinter.AsynncTask;
using Net.Posprinter.Posprinterface;
using Net.Posprinter.Service;
using Net.Posprinter.Utils;
using Plugin.CurrentActivity;
using Plugin.Iconize;
using static Firebase.Storage.FileDownloadTask;
using static Firebase.Storage.StreamDownloadTask;
using static Net.Posprinter.Utils.PosPrinterDev;
using TaskSnapshot = Firebase.Storage.StreamDownloadTask.TaskSnapshot;

namespace Florid.Staff.Droid
{

    [Application(UsesCleartextTraffic = true)]
    public class MainApplication : BaseMainApplication
    {
        private static IMyCustomBinder _binder;
        private MyServiceConnection _serviceConnection;
        public static bool ISCONNECT;
        private bool _isPrinter = false;

        public IMyCustomBinder MyBinder
        {
            get
            {
                return _binder;
            }
        }

        BaseActivity _currentActivity => (BaseActivity)CrossCurrentActivity.Current.Activity;

        public MainApplication(IntPtr javaReference, JniHandleOwnership transfer) : base(javaReference, transfer)
        {
        }

        public MainApplication()
        {

        }

        public override void OnCreate()
        {
            base.OnCreate();

            CrossCurrentActivity.Current.Init(this);

            ServiceLocator.Instance.Register<INormalDBSession<FirebaseClient>, FirebaseDBSession>(Constants.MAIN_DATABASE_PATH);
            ServiceLocator.Instance.Register<IUserRepository, UserRepository>();
            ServiceLocator.Instance.Register<IReceiptPrintJobRepository, ReceiptPrintJobRepository>();
            ServiceLocator.Instance.Register<ISecureConfig, NativeDroidSecureConfig>();

            _serviceConnection = new MyServiceConnection((binder) =>
            {
                _binder = (IMyCustomBinder)binder;
            });

            Intent intent = new Intent(this, typeof(MyService));
            BindService(intent, _serviceConnection, Bind.AutoCreate);
        }

        public bool IsPrinter()
        {
            return _isPrinter;
        }

        public void SetIsPrinter(bool isPrinter)
        {
            _isPrinter = isPrinter;
        }

        public class MyFirebaseStreamProcessor : Java.Lang.Object, IStreamProcessor
        {
            Action<Stream> _streamDownloadCallback;
            public MyFirebaseStreamProcessor(Action<Stream> streamDownloadCallback)
            {
                _streamDownloadCallback = streamDownloadCallback;
            }

            public void DoInBackground(TaskSnapshot state, Stream stream)
            {
                _streamDownloadCallback?.Invoke(stream);
            }
        }


        public void DoPrintJob(string url)
        {
            if (!ISCONNECT)
                return;

            FirebaseStorage storage = FirebaseStorage.Instance;

            StorageReference httpsReference = storage.GetReferenceFromUrl(url);//https://firebasestorage.googleapis.com/v0/b/lorid-e9c34.appspot.com/o/receipts%2Freceipt1.png?alt=media&token=174fb53c-d25e-4ebe-8b8d-48b7cbb3e575

            httpsReference.GetStream(new MyFirebaseStreamProcessor((str) =>
            {
                using (var bitmap = BitmapFactory.DecodeStream(str).ResizeImage(440, false))
                {
                    var manualEvent = new ManualResetEvent(false);

                    manualEvent.Reset();

                    _binder.WriteDataByYouself(new MyUiExecute(() =>
                    {

                    }, () =>
                    {
                        ShowSnackbar("Printing Error!!!!", AlertType.Error);

                    }), new MyProcessDataCallback(bitmap, () =>
                    {
                        ShowSnackbar("Printing Completed!", AlertType.Info);
                        manualEvent.Set();
                    }));

                    manualEvent.WaitOne();
                }
            }));
        }

        public void DoPrintJob(Bitmap bitmap)
        {
            if (!ISCONNECT)
                return;

            var manualEvent = new ManualResetEvent(false);

            manualEvent.Reset();

            _binder.WriteDataByYouself(new MyUiExecute(() =>
            {
                DisconnectToBluetoothDevice();
            }, () =>
            {
                ShowSnackbar("Printing Error!!!!", AlertType.Error);

            }), new MyProcessDataCallback(bitmap, () =>
            {
                manualEvent.Set();
            }));

            manualEvent.WaitOne();

        }

        public void ConnectToBluetoothDevice(string macAddress, Action<bool> callback)
        {
            if (ISCONNECT)
            {
                callback?.Invoke(true);
                return;
            }

            _binder.ConnectBtPort(macAddress, new MyUiExecute(() =>
            {
                ISCONNECT = true;

                ShowSnackbar("Đã kết nối tới máy in!!", AlertType.Success);

                callback?.Invoke(true);

                _binder.Write(DataForSendToPrinterPos80.OpenOrCloseAutoReturnPrintState(0x1f), new MyUiExecute(() =>
                {
                    _binder.Acceptdatafromprinter(new MyUiExecute(() =>
                    {

                    }, () =>
                    {
                        ISCONNECT = false;
                        ShowSnackbar("Máy in bị ngắt kết nối !!", AlertType.Warning);
                        callback?.Invoke(false);

                    }));
                }, () =>
                {


                }));

            }, () =>
            {
                ISCONNECT = false;
                ShowSnackbar("Không thể kết nối tới máy in !!", AlertType.Error);
                callback?.Invoke(false);

            }));
        }

        public void DisconnectToBluetoothDevice()
        {
            if (!ISCONNECT)
                return;

            _binder.DisconnectCurrentPort(new MyUiExecute(() =>
            {
                ISCONNECT = false;
                //ShowSnackbar( "Đã ngắt kết nối tới máy in!!!", AlertType.Info);
            }, () =>
            {
                ShowSnackbar("Xảy ra lỗi khi ngắt kết nối tới máy in!!", AlertType.Error);
            }));
        }

        public void ErrorToast(string content)
        {
            ShowSnackbar(content, AlertType.Error);
        }
        public void InfoToast(string content)
        {
            ShowSnackbar(content, AlertType.Info);
        }
        public void ErrorWarning(string content)
        {
            ShowSnackbar(content, AlertType.Warning);
        }
        public void SuccessToast(string content)
        {
            ShowSnackbar(content, AlertType.Success);
        }

        public void ShowSnackbar(string content, AlertType alertType)
        {
            _currentActivity.RunOnUiThread(() =>
            {
                var bar = Snackbar.Make(_currentActivity.ParentContainer, content, Snackbar.LengthLong)
                  .SetActionTextColor(Color.White);

                bar.SetDuration(3000);

                TextView tv = (TextView)(bar.View).FindViewById(Resource.Id.snackbar_text);

                tv.SetTypeface(BaseModelHelper.Instance.CacheFonts[Resource.Font.bold], TypefaceStyle.Normal);
                tv.TextSize = 20;

                switch (alertType)
                {
                    case AlertType.Error:
                        bar.View.SetBackgroundColor(Color.Red);
                        break;
                    case AlertType.Info:
                        bar.View.SetBackgroundColor(Color.Blue);
                        break;
                    case AlertType.Success:
                        bar.View.SetBackgroundColor(Color.Green);
                        break;
                    case AlertType.Warning:
                        bar.View.SetBackgroundColor(Color.Yellow);
                        break;
                }

                bar.Show();
            });
        }
    }


}