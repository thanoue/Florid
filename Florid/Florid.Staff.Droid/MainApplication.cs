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
using static Florid.Staff.Droid.AcceptDataFromPrinterBackground;
using static Florid.Staff.Droid.ConnectBltDoingBackground;
using static Florid.Staff.Droid.DisconnectBltDoingBackground;
using static Net.Posprinter.Utils.PosPrinterDev;
using BitmapToByteData = Florid.Droid.Lib.Static.BitmapToByteData;
namespace Florid.Staff.Droid
{
    [Application(UsesCleartextTraffic = true)]
    public class MainApplication : BaseMainApplication
    {
        private static IMyBinder _binder;
        private MyServiceConnection _serviceConnection;
        public static bool ISCONNECT;

        public IMyBinder MyBinder
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
                _binder = (IMyBinder)binder;
            });

            Intent intent = new Intent(this, typeof(CustomService));
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

    [Service(Name = "Florid.Staff.Droid.CustomService")]
    public class CustomService : Service
    {
        private IBinder myBinder = new MyCustomBinder();

        public override IBinder OnBind(Intent intent)
        {
            return this.myBinder;
        }

        public override void OnCreate()
        {
            base.OnCreate();
        }

        public override bool OnUnbind(Intent intent)
        {
            return base.OnUnbind(intent);
        }


        public override void OnDestroy()
        {
            base.OnDestroy();

            ((MyCustomBinder)myBinder).Destroy();   

        }

        public class MyCustomBinder : Binder,IMyBinder, IConnectBltCallback, IDisconnectBltCallback,IAcceptDataFromPrinter
        {
            private PosPrinterDev xPrinterDev;
            private ReturnMessage mMsg;
            private bool isConnected = false;
            private RoundQueue que;

            public MyCustomBinder()
            {

            }

            private RoundQueue getinstaceRoundQueue()
            {
                if (this.que == null)
                {
                    this.que = new RoundQueue(500);
                }

                return this.que;
            }

            public void Destroy()
            {
                this.xPrinterDev?.Close();
            }

            public void Acceptdatafromprinter(IUiExecute p0)
            {
                var task = new PosAsynncTask(p0, new AcceptDataFromPrinterBackground(this));
                task.ExecuteOnExecutor(AsyncTask.ThreadPoolExecutor, new Java.Lang.Void[0]);
            }

            public void CheckLinkedState(IUiExecute p0)
            {
            }

            public void ClearBuffer()
            {
                que.Clear();
            }

            public void ConnectBtPort(string bluetoothID, IUiExecute execute)
            {
                var task = new PosAsynncTask(execute, new ConnectBltDoingBackground(this, bluetoothID));
                task.Execute(new Java.Lang.Void[0]);
            }

            public void ConnectNetPort(string p0, int p1, IUiExecute p2)
            {
            }

            public void ConnectUsbPort(Context p0, string p1, IUiExecute p2)
            {
            }

            public void DisconnectCurrentPort(IUiExecute p0)
            {
                var task = new PosAsynncTask(p0, new DisconnectBltDoingBackground(this));
                task.Execute(new Java.Lang.Void[0]);
            }

            public RoundQueue ReadBuffer()
            {
                return que ?? new RoundQueue(500);
            }

            public void Write(byte[] p0, IUiExecute p1)
            {
                var task = new PosAsynncTask(p1, new WriteBackgroundInit(p0, this.xPrinterDev, this.mMsg, (isSuccess) =>
                {
                    this.isConnected = isSuccess;

                }));
                task.Execute(new Java.Lang.Void[0]);
            }

            public void WriteDataByYouself(IUiExecute p0, IProcessData p1)
            {
                var task = new PosAsynncTask(p0, new PrintBitmapBackgroundInit(p1, this.xPrinterDev, this.mMsg, (isSuccess) =>
                {
                    this.isConnected = isSuccess;

                }));
                task.Execute(new Java.Lang.Void[0]);
            }

            public bool BltConnectDoingBackground(string bluetoothId)
            {

                this.xPrinterDev = new PosPrinterDev(PortType.Bluetooth, bluetoothId);

                mMsg = xPrinterDev.Open();

                if (mMsg.ErrorCode.Equals(ErrorCode.OpenPortSuccess)) {

                    isConnected = true;
                    return true;

                }
                else
                {
                    return false;
                }
            }

            public bool BltDisconnectDoingBackground()
            {
                mMsg = xPrinterDev.Close();
                if (mMsg.ErrorCode.Equals(ErrorCode.ClosePortSuccess)) {

                    if (que != null) {
                       que.Clear();
                    }

                    isConnected = false;

                    return true;
                } 
                else
                {
                    return false;
                }
            }

            public bool AcceptDataFromPrinterBackground()
            {
                que = getinstaceRoundQueue();
                byte[] buffer = new byte[4];
                que.Clear();
                //Log.i("TAG", PosprinterService.this.xPrinterDev.Read(buffer).GetErrorCode().toString());

                for (; xPrinterDev.Read(buffer).ErrorCode.Equals(ErrorCode.ReadDataSuccess); que.AddLast(buffer)) {
                    try
                    {
                        System.Threading.Thread.Sleep(500);
                    }
                    catch (InterruptedException var3)
                    {
                        //var3.printStackTrace();
                        return false;
                    }
                }

                isConnected = false;
                return false;
            }
        }
    }
   
    public class AcceptDataFromPrinterBackground : Java.Lang.Object, IBackgroundInit
    {
        public interface IAcceptDataFromPrinter
        {
            public bool AcceptDataFromPrinterBackground();
        }

        private IAcceptDataFromPrinter _callback;
        public AcceptDataFromPrinterBackground(IAcceptDataFromPrinter callback)
        {
            _callback = callback;
        }
        
        public bool Doinbackground()
        {
            return _callback.AcceptDataFromPrinterBackground();
        }

    }

    public class DisconnectBltDoingBackground : Java.Lang.Object, IBackgroundInit
    {
        public interface IDisconnectBltCallback
        {
            public bool BltDisconnectDoingBackground();
        }

        IDisconnectBltCallback _callback;

        public DisconnectBltDoingBackground(IDisconnectBltCallback callback)
        {
            _callback = callback;
        }

        public bool Doinbackground()
        {
            return _callback.BltDisconnectDoingBackground();
        }
    }

    public class ConnectBltDoingBackground : Java.Lang.Object, IBackgroundInit
    {
        public interface IConnectBltCallback
        {
            public bool BltConnectDoingBackground(string bluetoothId);
        }

        IConnectBltCallback _callback;
        string _bluetoothId = "";
        
        public ConnectBltDoingBackground(IConnectBltCallback callback, string bluetoothId)
        {
            _bluetoothId = bluetoothId;
            _callback = callback;
        }

        public bool Doinbackground()
        {
            return _callback.BltConnectDoingBackground(_bluetoothId);
        }
    }

    public class WriteBackgroundInit : Java.Lang.Object, IBackgroundInit
    {
        private ReturnMessage _msg;
        private byte[] _data;
        private PosPrinterDev _xPrinterDev;
        Action<bool> _finishCallback;

        public WriteBackgroundInit(byte[] data, PosPrinterDev xPrinterDev, ReturnMessage mMsg, Action<bool> finishCallback)
        {
            _data = data;
            _msg = mMsg;
            _xPrinterDev = xPrinterDev;
            _finishCallback = finishCallback;
        }

        public bool Doinbackground()
        {
            if (_data != null)
            {
                _msg = _xPrinterDev.Write(_data);
                if (_msg.ErrorCode.Equals(ErrorCode.WriteDataSuccess)) {
                    _finishCallback?.Invoke(true);
                    return true;
                }

                _finishCallback?.Invoke(false);

            }

            return false;
        }
    }

    public class PrintBitmapBackgroundInit : Java.Lang.Object, IBackgroundInit
    {
        private ReturnMessage _msg;
        IProcessData _processData;
        private PosPrinterDev xPrinterDev;

        Action<bool> _finishCallback;

        public PrintBitmapBackgroundInit(IProcessData processData, PosPrinterDev xPrinterDev, ReturnMessage mMsg, Action<bool> finishCallback)
        {
            _processData = processData;
            this.xPrinterDev = xPrinterDev;
            _msg = mMsg;
            _finishCallback =  finishCallback;
        }

        public bool Doinbackground()
        {
            var list = _processData.ProcessDataBeforeSend().ToList();

            if (list != null)
            {
                for (int i = 0; i < list.Count; i++)
                {
                    var bytes = list[i];
                    _msg = xPrinterDev.Write(bytes);
                }

                if (_msg.ErrorCode.Equals(ErrorCode.WriteDataSuccess)) {
                    _finishCallback?.Invoke(true);
                    return true;
                }

            }

            _finishCallback?.Invoke(false);

            return false;

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
            list.Add(BitmapToByteData.RasterBmpToSendData(0, _bitmap, BitmapToByteData.BmpType.Threshold, BitmapToByteData.AlignType.Left, 580));
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