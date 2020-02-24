package com.khoideptrai.posprinter;

import android.app.Activity;
import android.os.AsyncTask;

import net.posprinter.posprinterface.BackgroundInit;
import net.posprinter.posprinterface.UiExecute;

public class BackgroundHandle {

    UiExecute execute;
    BackgroundInit init;
    Activity mActivity;

    public BackgroundHandle(Activity activity, UiExecute execute, BackgroundInit init) {
        this.execute = execute;
        this.init = init;
        this.mActivity = activity;
    }


    public void execute(){

        AsyncTask.execute(new Runnable() {
            @Override
            public void run() {
                boolean backgroundRes =  init.doinbackground();
            }
        });

        mActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {

            }
        });
    }

}
