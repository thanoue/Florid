package com.khoideptrai.posprinter;

import android.content.Context;

import net.posprinter.posprinterface.ProcessData;
import net.posprinter.posprinterface.UiExecute;
import net.posprinter.utils.RoundQueue;

public interface IMyCustomBinder {
    void connectNetPort(String var1, int var2, UiExecute var3);

    void connectBtPort(String var1, UiExecute var2);

    void connectUsbPort(Context var1, String var2, UiExecute var3);

    void disconnectCurrentPort(UiExecute var1);

    void acceptdatafromprinter(UiExecute var1);

    RoundQueue<byte[]> readBuffer();

    void clearBuffer();

    void checkLinkedState(UiExecute var1);

    void write(byte[] var1, UiExecute var2);

    void writeDataByYouself(UiExecute var1, ProcessData var2);

    void initRoundQueue();

    void destroy();
}
