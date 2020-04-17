using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Android.App;
using Android.Content;
using Android.Gms.Tasks;
using Android.Graphics;
using Android.OS;
using Android.Runtime;
using Android.Util;
using Android.Views;
using Android.Widget;
using Com.Khoideptrai.Posprinter;
using Java.Lang;
using Net.Posprinter.AsynncTask;
using Net.Posprinter.Posprinterface;
using Net.Posprinter.Utils;
using static Net.Posprinter.Utils.PosPrinterDev;

namespace Florid.Staff.Droid.Services
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


    public class BindingBinder : CustomBinder, PrintBitmapBackgroundInit.IBackground
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


    [Service(Name = "florid.staff.froid.MyService")]
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
            list.Add(BitmapToByteData.RasterBmpToSendData(0, _bitmap, BitmapToByteData.BmpType.Threshold, BitmapToByteData.AlignType.Center, 430));
            list.Add(DataForSendToPrinterPos58.PrintAndFeedLine());

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

    public class FirebaseTaskCallback : Java.Lang.Object, IOnSuccessListener, IOnFailureListener, IOnCompleteListener
    {
        Action<Java.Lang.Object> _successCallback;
        Action<Java.Lang.Exception> _failureCallback;
        private Action<Task> _completeCallback;

        public FirebaseTaskCallback(Action<Java.Lang.Object> successCallback)
        {
            _successCallback = successCallback;
        }

        public FirebaseTaskCallback(Action<Java.Lang.Exception> failureCallback)
        {
            _failureCallback = failureCallback;
        }

        public FirebaseTaskCallback(Action<Task> completeCallback)
        {
            _completeCallback = completeCallback;
        }

        public void OnComplete(Task task)
        {
            _completeCallback?.Invoke(task);
        }

        public void OnFailure(Java.Lang.Exception e)
        {
            _failureCallback?.Invoke(e);
        }

        public void OnSuccess(Java.Lang.Object result)
        {
            _successCallback?.Invoke(result);
        }
    }
}