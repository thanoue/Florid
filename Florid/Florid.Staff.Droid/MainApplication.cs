using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using Android.App;
using Android.Content;
using Android.Graphics;
using Android.OS;
using Android.Runtime;
using Android.Support.Design.Widget;
using Android.Util;
using Android.Views;
using Android.Widget;
using Com.Khoideptrai.Posprinter;
using Florid.Core;
using Florid.Core.Service;
using Florid.Droid.Lib;
using Florid.Entity;
using Florid.Staff.Droid.Activity;
using Florid.Staff.Droid.Repository;
using Java.Lang;
using Net.Posprinter.AsynncTask;
using Net.Posprinter.Posprinterface;
using Net.Posprinter.Service;
using Net.Posprinter.Utils;
using Plugin.Iconize;
using static Net.Posprinter.Utils.PosPrinterDev;
namespace Florid.Staff.Droid
{
    public class PrintBitmapBackgroundInit : Java.Lang.Object, IBackgroundInit
    {
        public interface IBackground
        {
            bool PrintBitmapBackground(IProcessData processData);
        }

        IProcessData _processData;

        IBackground _backgroundInit;

        public PrintBitmapBackgroundInit(IProcessData processData, IBackground backgroundInit)
        {
            _processData = processData;
            _backgroundInit = backgroundInit;
        }

        public bool Doinbackground()
        {
            return _backgroundInit.PrintBitmapBackground(_processData);
        }
    }


    public class BindingBinder : CustomBinder,PrintBitmapBackgroundInit.IBackground
    {
        public bool PrintBitmapBackground(IProcessData processData)
        {
            var list = processData.ProcessDataBeforeSend().ToList();

            if (list != null)
            {
                for (int i = 0; i < list.Count; i++)
                {
                    var bytes = list[i];
                    MMsg = XPrinterDev.Write(bytes);
                }

                if (MMsg.ErrorCode.Equals(ErrorCode.WriteDataSuccess))
                {
                    return true;
                }

            }

            return false;
        }

        public override void WriteDataByYouself(IUiExecute execute, IProcessData processData)
        {
            var posAsync = new PosAsynncTask(execute, new PrintBitmapBackgroundInit(processData, this));

            posAsync.Execute(new Java.Lang.Void[0]);
        }
    }

    [Service(Name = "Florid.Staff.Droid.MyService")]
    public class MyService : Service
    {
        protected IBinder MyBinder = new BindingBinder();

        public override IBinder OnBind(Intent intent)
        {
            return this.MyBinder;
        }

        public override void OnCreate()
        {
            base.OnCreate();
            ((IMyCustomBinder)MyBinder).InitRoundQueue();
        }

        public override bool OnUnbind(Intent intent)
        {
            return base.OnUnbind(intent);
        }

        public override void OnDestroy()
        {
            base.OnDestroy();
            ((IMyCustomBinder)MyBinder).Destroy();
        }
    }

    [Application(UsesCleartextTraffic = true)]
    public class MainApplication : BaseMainApplication
    {
        private static IMyCustomBinder _binder;
        private MyServiceConnection _serviceConnection;
        public static bool ISCONNECT;

        public IMyCustomBinder MyBinder
        {
            get
            {
                return _binder;
            }
        }

        public MainApplication(IntPtr javaReference, JniHandleOwnership transfer) : base(javaReference, transfer)
        {
        }

        public MainApplication()
        {
        }

        public override void OnCreate()
        {
            base.OnCreate();

            ServiceLocator.Instance.Register<IUserRepository, UserRepository>();

            _serviceConnection = new MyServiceConnection((binder) =>
            {
                _binder = (IMyCustomBinder)binder;
            });

            Intent intent = new Intent(this, typeof(MyService));
            BindService(intent, _serviceConnection, Bind.AutoCreate);
        }

        public void ConnectToBluetoothDevice(BaseActivity activity, string macAddress, Action<bool> callback)
        {
            if (ISCONNECT)
                return;

            _binder.ConnectBtPort(macAddress, new MyUiExecute(() =>
            {
                ISCONNECT = true;

                ShowSnackbar(activity, "Đã kết nối tới máy in!!", AlertType.Success);

                callback?.Invoke(true);

                _binder.Write(DataForSendToPrinterPos80.OpenOrCloseAutoReturnPrintState(0x1f), new MyUiExecute(() =>
                {
                    _binder.Acceptdatafromprinter(new MyUiExecute(() =>
                    {

                    }, () =>
                    {
                        ISCONNECT = false;
                        ShowSnackbar(activity, "Máy in bị ngắt kết nối !!", AlertType.Warning);
                        callback?.Invoke(false);

                    }));
                }, () =>
                {


                }));

            }, () =>
            {
                ISCONNECT = false;
                ShowSnackbar(activity, "Không thể kết nối tới máy in !!", AlertType.Error);
                callback?.Invoke(false);

            }));
        }

        public void DisconnectToBluetoothDevice(BaseActivity activity)
        {
            if (!ISCONNECT)
                return;
            _binder.DisconnectCurrentPort(new MyUiExecute(() =>
            {
                ISCONNECT = false;
                ShowSnackbar(activity, "Đã ngắt kết nối tới máy in!!!", AlertType.Info);
            }, () =>
            {
                ShowSnackbar(activity, "Xảy ra lỗi khi ngắt kết nối tới máy in!!", AlertType.Error);

            }));
        }

        public void ShowSnackbar(BaseActivity activity, string content, AlertType alertType)
        {
            activity.RunOnUiThread(() =>
            {
                var bar = Snackbar.Make(activity.ParentContainer, content, Snackbar.LengthLong)
                  .SetActionTextColor(Color.White);

                TextView tv = (TextView)(bar.View).FindViewById(Resource.Id.snackbar_text);

                tv.SetTypeface(BaseModelHelper.Instance.CacheFonts[Resource.Font.super_regular], TypefaceStyle.Normal);

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

   
    public enum AlertType
    {
        Info,
        Error,
        Success,
        Warning
    }

    public class MyProcessDataCallback : Java.Lang.Object, IProcessData
    {
        Bitmap _bitmap;
        Action _completeProcess;
        public MyProcessDataCallback(Bitmap bitmap, Action completeProcess)
        {
            _bitmap = bitmap;
            _completeProcess = completeProcess;
        }

        public IList<byte[]> ProcessDataBeforeSend()
        {
            var list = new List<byte[]>();

            list.Add(DataForSendToPrinterPos58.InitializePrinter());
            list.Add(BitmapToByteData.RasterBmpToSendData(0, _bitmap, BitmapToByteData.BmpType.Threshold, BitmapToByteData.AlignType.Left, _bitmap.Width));
            list.Add(DataForSendToPrinterPos58.PrintAndFeedForward(3));

            _completeProcess?.Invoke();

            return list;
        }
    }

    public class MyUiExecute : Java.Lang.Object, IUiExecute
    {
        Action _onSuccess, _onFailed;
        public MyUiExecute(Action onSuccess, Action onFailed)
        {
            _onSuccess = onSuccess;
            _onFailed = onFailed;
        }
        public void Onfailed()
        {
            _onFailed?.Invoke();
        }

        public void Onsucess()
        {
            _onSuccess?.Invoke();
        }
    }

    public class MyServiceConnection : Java.Lang.Object, IServiceConnection
    {
        Action<IBinder> _binderCallback;
        public MyServiceConnection(Action<IBinder> binderCallback)
        {
            _binderCallback = binderCallback;
        }

        public void OnServiceConnected(ComponentName name, IBinder service)
        {
            _binderCallback?.Invoke(service);
        }

        public void OnServiceDisconnected(ComponentName name)
        {
            Log.Error("disbinder", "disconnected");
        }
    }
}