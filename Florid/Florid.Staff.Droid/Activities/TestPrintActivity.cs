
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Android;
using Android.App;
using Android.Content;
using Android.Content.PM;
using Android.Graphics;
using Android.OS;
using Android.Runtime;
using Android.Support.V4.App;
using Android.Support.V4.Content;
using Android.Views;
using Android.Widget;
using Com.Dantsu.Escposprinter;
using Com.Dantsu.Escposprinter.Connection;
using Com.Dantsu.Escposprinter.Connection.Bluetooth;
using Com.Dantsu.Escposprinter.Textparser;
using Florid.Staff.Droid.Activity;
using Florid.Staff.Droid.AsyncTasks;

namespace Florid.Staff.Droid
{
    [Activity(MainLauncher = false)]
    public class TestPrintActivity : BaseActivity
    {
        protected override int LayoutId => Resource.Layout.printer_layout;

        BluetoothConnection _connection = null;

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            // Create your application here
        }

        protected override void InitView(ViewGroup viewGroup)
        {
            FindViewById<Button>(Resource.Id.printBtn).Click += TestPrintActivity_Click; ;
        }

        private void TestPrintActivity_Click(object sender, EventArgs e)
        {
            PrintBluetooth();
        }

        void PrintBluetooth()
        {
            if (ContextCompat.CheckSelfPermission(this, Manifest.Permission.Bluetooth) != Android.Content.PM.Permission.Granted)
            {
                ActivityCompat.RequestPermissions(this, new string[] { Manifest.Permission.Bluetooth }, 1);
            }
            else
            {
                var task = new AsyncBluetoothEscPosPrint("DC:0D:30:2F:49:8F", this,null);

                task.Execute(GetAsyncEscPosPrinter(null));
            }
        }

        public override void OnRequestPermissionsResult(int requestCode, string[] permissions, [GeneratedEnum] Permission[] grantResults)
        {
            if (grantResults.Length > 0 && grantResults[0] == Permission.Granted)
            {
                if (requestCode == 1)
                {
                    PrintBluetooth();
                }
            }
        }

        AsyncEscPosPrinter GetAsyncEscPosPrinter(DeviceConnection printerConnection)
        {
            AsyncEscPosPrinter printer = new AsyncEscPosPrinter(printerConnection, 203, 48f, 32);

            return printer.SetTextToPrint(
                       "[L]\n" +
                       "[C]<b><font size='big'>FLORID</font></b>\n" +
                       "[L]\n" +
                       "[C]783 Phan Van Tri,Ward 7, Go Vap\n" +
                       "[C]Ho Chi Minh City, 700000\n" +
                       "[C]Tel: 0931281122\n" +
                       "[C]Facebook: fb.com/floridshop\n" +
                       "[L]\n" +
                       "[C]<b><font size='wide'>RECIPT</font></b>\n" +
                       "[C]--------------------------------\n" +
                       "[C]<b><font size='small'>Recipt Id: 100_20</font></b>\n" +
                       "[C]<b><font size='small'>Time: 8:24:24 PM, 14/10/2020</font></b>\n" +
                       "[C]--------------------------------\n" +
                       "[L]\n" +
                       "[L]   Name[R]Price\n" +
                       "[L]\n" +

                       "[L]1  MS 1646[R]480.000 vnd\n" +
                       "[L]   Discount[R]100.000 vnd\n" +
                       "[L]\n" +

                       "[L]1  MS 1646[R]480.000 vnd\n" +
                       "[L]   Discount[R]100.000 vnd\n" +
                       "[L]\n" +

                       "[L]1  MS 1646[R]480.000 vnd\n" +
                       "[L]   Discount[R]100.000 vnd\n" +
                       "[L]\n" +

                       "[L]1  MS 1646[R]480.000 vnd\n" +
                       "[L]   Discount[R]100.000 vnd\n" +
                       "[L]\n" +

                       "[L]1  MS 1646[R]480.000 vnd\n" +
                       "[L]   Discount[R]100.000 vnd\n" +
                       "[L]\n" +

                       "[L]1  MS 1646[R]480.000 vnd\n" +
                       "[L]   Discount[R]100.000 vnd\n" +
                       "[C]--------------------------------\n" +
                       "[L]\n" +

                       "[L]Sum:[R]2.380.000 vnd\n" +
                       "[L]Discount Total:[R]100.000 d\n"+
                       "[L]Amount:[R]2.175.000 vnd\n" +
                       "[L]Paid:[R]2.175.000 vnd\n" +
                       "[L]Balance:[R]0 vnd\n" +

                       "[L]\n" +
                       "[C]<b><font size='medium'>VAT is Included</font></b>\n" +

                       "[C]--------------------------------\n" +
                       "[L]\n" +

                       "[C]<b><font size='medium'>Customer Information</font></b>\n" +
                       "[L]Using Scores:[R]3\n" +
                       "[L]Recipt Scores:[R]21.75\n" +
                       "[L]Total Scores:[R]23.75d\n" +

                       "[L]\n" +
                       "[C]<qrcode size='20'>https://www.facebook.com/floridshop</qrcode>\n" +
                       "[L]\n"
                      );
        }
    }
}
