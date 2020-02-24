package com.khoideptrai.posprinter;

import android.content.Context;
import android.os.AsyncTask;
import android.os.Binder;
import android.util.Log;
import android.util.Printer;

import net.posprinter.asynncTask.PosAsynncTask;
import net.posprinter.posprinterface.BackgroundInit;
import net.posprinter.posprinterface.IMyBinder;
import net.posprinter.posprinterface.ProcessData;
import net.posprinter.posprinterface.UiExecute;
import net.posprinter.utils.PosPrinterDev;
import net.posprinter.utils.RoundQueue;

import java.util.List;

public class CustomBinder extends Binder implements IMyCustomBinder {

    protected  PosPrinterDev xPrinterDev;
    protected  PosPrinterDev.ReturnMessage mMsg;
    protected  boolean isConnect = false;
    protected  RoundQueue<byte[]> que;

    public   RoundQueue<byte[]> getinstaceRoundQueue() {
        if (que == null) {
            que = new RoundQueue(500);
        }

        return que;
    }

    public void initRoundQueue() {
        que = this.getinstaceRoundQueue();
    }

    public void destroy(){
        if (xPrinterDev != null) {
            xPrinterDev.Close();
        }
    }

    public CustomBinder() {
    }

    public void connectNetPort(final String ethernetIP, final int ethernetPort, UiExecute execute) {
        PosAsynncTask task = new PosAsynncTask(execute, new BackgroundInit() {
            public boolean doinbackground() {
                xPrinterDev = new PosPrinterDev(PosPrinterDev.PortType.Ethernet, ethernetIP, ethernetPort);
                mMsg = xPrinterDev.Open();
                if (mMsg.GetErrorCode().equals(PosPrinterDev.ErrorCode.OpenPortSuccess)) {
                    isConnect = true;
                    return true;
                } else {
                    return false;
                }
            }
        });
        task.execute(new Void[0]);
    }

    public void connectBtPort(final String bluetoothID, UiExecute execute) {
        PosAsynncTask task = new PosAsynncTask(execute, new BackgroundInit() {
            public boolean doinbackground() {
                xPrinterDev = new PosPrinterDev(PosPrinterDev.PortType.Bluetooth, bluetoothID);
                mMsg = xPrinterDev.Open();
                if (mMsg.GetErrorCode().equals(PosPrinterDev.ErrorCode.OpenPortSuccess)) {
                    isConnect = true;
                    return true;
                } else {
                    return false;
                }
            }
        });
        task.execute(new Void[0]);
    }

    public void connectUsbPort(final Context context, final String usbPathName, UiExecute execute) {
        PosAsynncTask task = new PosAsynncTask(execute, new BackgroundInit() {
            public boolean doinbackground() {
                xPrinterDev = new PosPrinterDev(PosPrinterDev.PortType.USB, context, usbPathName);
                mMsg = xPrinterDev.Open();
                if (mMsg.GetErrorCode().equals(PosPrinterDev.ErrorCode.OpenPortSuccess)) {
                    isConnect = true;
                    return true;
                } else {
                    return false;
                }
            }
        });
        task.execute(new Void[0]);
    }

    public void disconnectCurrentPort(UiExecute execute) {
        PosAsynncTask task = new PosAsynncTask(execute, new BackgroundInit() {
            public boolean doinbackground() {
                mMsg = xPrinterDev.Close();
                if (mMsg.GetErrorCode().equals(PosPrinterDev.ErrorCode.ClosePortSuccess)) {
                    isConnect = false;
                    if (que != null) {
                        que.clear();
                    }

                    return true;
                } else {
                    return false;
                }
            }
        });
        task.execute(new Void[0]);
    }

    public void write(final byte[] data, UiExecute execute) {
        PosAsynncTask task = new PosAsynncTask(execute, new BackgroundInit() {
            public boolean doinbackground() {
                if (data != null) {
                    mMsg = xPrinterDev.Write(data);
                    if (mMsg.GetErrorCode().equals(PosPrinterDev.ErrorCode.WriteDataSuccess)) {
                        isConnect = true;
                        return true;
                    }

                    isConnect = false;
                }

                return false;
            }
        });
        task.execute(new Void[0]);
    }

    public void writeDataByYouself(UiExecute execute, final ProcessData processData) {
        PosAsynncTask task = new PosAsynncTask(execute, new BackgroundInit() {
            public boolean doinbackground() {
                List<byte[]> list = processData.processDataBeforeSend();
                if (list != null) {
                    for(int i = 0; i < list.size(); ++i) {
                        mMsg = xPrinterDev.Write((byte[])list.get(i));
                    }

                    if (mMsg.GetErrorCode().equals(PosPrinterDev.ErrorCode.WriteDataSuccess)) {
                        isConnect = true;
                        return true;
                    }

                    isConnect = false;
                }

                return false;
            }
        });
        task.execute(new Void[0]);
    }



    public void acceptdatafromprinter(UiExecute execute) {
        PosAsynncTask task = new PosAsynncTask(execute, new BackgroundInit() {
            public boolean doinbackground() {
                que =getinstaceRoundQueue();
                byte[] buffer = new byte[4];
                que.clear();
                Log.i("TAG", xPrinterDev.Read(buffer).GetErrorCode().toString());

                for(; xPrinterDev.Read(buffer).GetErrorCode().equals(PosPrinterDev.ErrorCode.ReadDataSuccess); que.addLast(buffer)) {
                    try {
                        Thread.sleep(500L);
                    } catch (InterruptedException var3) {
                        var3.printStackTrace();
                        return false;
                    }
                }

                isConnect = false;
                return false;
            }
        });
        task.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR, new Void[0]);
    }

    public RoundQueue<byte[]> readBuffer() {
        new RoundQueue(500);
        RoundQueue<byte[]> queue =que;
        return queue;
    }

    public void clearBuffer() {
        que.clear();
    }

    public void checkLinkedState(UiExecute execute) {
        PosAsynncTask task = new PosAsynncTask(execute, new BackgroundInit() {
            public boolean doinbackground() {
                while(isConnect) {
                    isConnect = xPrinterDev.GetPortInfo().PortIsOpen();
                }

                return false;
            }
        });
        task.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR, new Void[0]);
    }
}