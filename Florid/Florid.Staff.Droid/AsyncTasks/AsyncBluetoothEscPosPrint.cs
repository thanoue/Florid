using System;
using Android.Content;
using Com.Dantsu.Escposprinter.Connection;
using Com.Dantsu.Escposprinter.Connection.Bluetooth;

namespace Florid.Staff.Droid.AsyncTasks
{
    public class AsyncBluetoothEscPosPrint : AsyncEscPosPrint
    {
        public AsyncBluetoothEscPosPrint(string wishingAddress,Context context,Action onCompeleted):base(context,wishingAddress, onCompeleted)
        {
        }

        protected override int RunInBackground(params AsyncEscPosPrinter[] printersData)
        {
            if (printersData.Length == 0)
            {
                return AsyncEscPosPrint.FINISH_NO_PRINTER;
            }

            AsyncEscPosPrinter printerData = printersData[0];

            DeviceConnection deviceConnection = printerData.GetPrinterConnection();

            if (deviceConnection == null)
            {
                this.PublishProgress(AsyncEscPosPrint.PROGRESS_CONNECTING);

                var connection = BluetoothPrintersConnections.SelectFirstPaired(WishingAddress);

                printersData[0] = new AsyncEscPosPrinter(
                        connection,
                        printerData.PrinterDpi,
                        printerData.PrinterWidthMM,
                        printerData.PrinterNbrCharactersPerLine
                );
                printersData[0].SetTextToPrint(printerData.GetTextToPrint());
            }

            return base.RunInBackground(printersData);
        }
    }
}
