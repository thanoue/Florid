using System;
using System.Diagnostics.CodeAnalysis;
using Android.App;
using Android.Content;
using Android.OS;
using Com.Dantsu.Escposprinter;
using Com.Dantsu.Escposprinter.Connection;
using Com.Dantsu.Escposprinter.Connection.Bluetooth;
using Com.Dantsu.Escposprinter.Exceptions;

namespace Florid.Staff.Droid.AsyncTasks
{
    public class AsyncEscPosPrint : AsyncTask<AsyncEscPosPrinter, int, int>
    {
        protected const int FINISH_SUCCESS = 1;
        protected const int FINISH_NO_PRINTER = 2;
        protected const int FINISH_PRINTER_DISCONNECTED = 3;
        protected const int FINISH_PARSER_ERROR = 4;
        protected const int FINISH_ENCODING_ERROR = 5;
        protected const int FINISH_BARCODE_ERROR = 6;
        protected const int PROGRESS_CONNECTING = 1;
        protected const int PROGRESS_CONNECTED = 2;
        protected const int PROGRESS_PRINTING = 3;
        protected const int PROGRESS_PRINTED = 4;
        protected string WishingAddress;

        protected ProgressDialog dialog;
        protected WeakReference<Context> weakContext;
        Action _onCompleted;

        public AsyncEscPosPrint(Context context, string wishingAddress, Action onCompleted)
        {
            this.weakContext = new WeakReference<Context>(context);
            WishingAddress = wishingAddress;
            _onCompleted = onCompleted;
        }

        protected override int RunInBackground(params AsyncEscPosPrinter[] printersData)
        {
            if (printersData.Length == 0)
            {
                return AsyncEscPosPrint.FINISH_NO_PRINTER;
            }

            this.PublishProgress(AsyncEscPosPrint.PROGRESS_CONNECTING);

            AsyncEscPosPrinter printerData = printersData[0];

            try
            {
                DeviceConnection deviceConnection = printerData.GetPrinterConnection();

                if (deviceConnection == null)
                {
                    deviceConnection = BluetoothPrintersConnections.SelectFirstPaired(WishingAddress);
                }

                if (deviceConnection == null)
                {
                    return AsyncEscPosPrint.FINISH_NO_PRINTER;
                }

                EscPosPrinter printer = new EscPosPrinter(deviceConnection, printerData.PrinterDpi, printerData.PrinterWidthMM, printerData.PrinterNbrCharactersPerLine);

                this.PublishProgress(AsyncEscPosPrint.PROGRESS_PRINTING);

                printer.PrintFormattedTextAndCut(printerData.GetTextToPrint());

                this.PublishProgress(AsyncEscPosPrint.PROGRESS_PRINTED);

            }
            catch (EscPosConnectionException e)
            {
                return AsyncEscPosPrint.FINISH_PRINTER_DISCONNECTED;
            }
            catch (EscPosParserException e)
            {
                return AsyncEscPosPrint.FINISH_PARSER_ERROR;
            }
            catch (EscPosEncodingException e)
            {
                return AsyncEscPosPrint.FINISH_ENCODING_ERROR;
            }
            catch (EscPosBarcodeException e)
            {
                return AsyncEscPosPrint.FINISH_BARCODE_ERROR;
            }

            return AsyncEscPosPrint.FINISH_SUCCESS;
        }

        protected override void OnPreExecute()
        {
            base.OnPreExecute();

            if (this.dialog == null)
            {
               if( weakContext.TryGetTarget(out Context context))
                {

                    this.dialog = new ProgressDialog(context);
                    this.dialog.SetTitle("Printing in progress...");
                    this.dialog.SetMessage("...");
                    this.dialog.SetProgressNumberFormat("%1d / %2d");
                    this.dialog.SetCancelable(false);
                    this.dialog.Indeterminate = (false);
                    this.dialog.SetProgressStyle(ProgressDialogStyle.Horizontal);
                    this.dialog.Show();
                }
            }
        }

        protected override void OnProgressUpdate(params int[] progress)
        {
            switch (progress[0])
            {
                case AsyncEscPosPrint.PROGRESS_CONNECTING:
                    this.dialog.SetMessage("Connecting printer...");
                    break;
                case AsyncEscPosPrint.PROGRESS_CONNECTED:
                    this.dialog.SetMessage("Printer is connected...");
                    break;
                case AsyncEscPosPrint.PROGRESS_PRINTING:
                    this.dialog.SetMessage("Printer is printing...");
                    break;
                case AsyncEscPosPrint.PROGRESS_PRINTED:
                    this.dialog.SetMessage("Printer has finished...");
                    break;
            }
            this.dialog.Progress = (progress[0]);
            this.dialog.Max = (4);
        }

        protected override void OnPostExecute([AllowNull] int result)
        {
            base.OnPostExecute(result);

            this.dialog.Dismiss();
            this.dialog = null;

            if (weakContext.TryGetTarget(out Context context))
            {
                switch (result)
                {
                    case AsyncEscPosPrint.FINISH_SUCCESS:
                        //new AlertDialog.Builder(context)
                        //        .SetTitle("Success")
                        //        .SetMessage("Congratulation ! The text is printed !")
                        //        .Show();
                        _onCompleted?.Invoke();
                        break;
                    case AsyncEscPosPrint.FINISH_NO_PRINTER:
                        new AlertDialog.Builder(context)
                                .SetTitle("No printer")
                                .SetMessage("The application can't find any printer connected.")
                                .Show();
                        break;
                    case AsyncEscPosPrint.FINISH_PRINTER_DISCONNECTED:
                        new AlertDialog.Builder(context)
                            .SetTitle("Broken connection")
                            .SetMessage("Unable to connect the printer.")
                            .Show();
                        break;
                    case AsyncEscPosPrint.FINISH_PARSER_ERROR:
                        new AlertDialog.Builder(context)
                            .SetTitle("Invalid formatted text")
                            .SetMessage("It seems to be an invalid syntax problem.")
                            .Show();
                        break;
                    case AsyncEscPosPrint.FINISH_ENCODING_ERROR:
                        new AlertDialog.Builder(context)
                            .SetTitle("Bad selected encoding")
                            .SetMessage("The selected encoding character returning an error.")
                            .Show();
                        break;
                    case AsyncEscPosPrint.FINISH_BARCODE_ERROR:
                        new AlertDialog.Builder(context)
                            .SetTitle("Invalid barcode")
                            .SetMessage("Data send to be converted to barcode or QR code seems to be invalid.")
                            .Show();
                        break;
                }
            }
        }
    }
}
