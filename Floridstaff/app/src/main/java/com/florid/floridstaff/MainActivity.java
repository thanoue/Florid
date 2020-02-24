package com.florid.floridstaff;

import androidx.appcompat.app.AppCompatActivity;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;

import net.posprinter.posprinterface.IMyBinder;
import net.posprinter.service.PosprinterService;

public class MainActivity extends Activity {

    public static IMyBinder binder;

    ServiceConnection conn= new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
            //Bind successfully
            binder= (IMyBinder) iBinder;
            Log.e("binder","connected");
        }

        @Override
        public void onServiceDisconnected(ComponentName componentName) {
            Log.e("disbinder","disconnected");
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent intent=new Intent(this,PosprinterService.class);
        bindService(intent, conn, BIND_AUTO_CREATE);
        //init view

        setContentView(R.layout.activity_main);


    }

    @Override
    protected void onResume() {
        super.onResume();
    }
}
