using System;
using Com.Dantsu.Escposprinter;
using Com.Dantsu.Escposprinter.Connection;

namespace Florid.Staff.Droid.AsyncTasks
{
    public class AsyncEscPosPrinter : EscPosPrinterSize
    {
        private DeviceConnection printerConnection;
        private string textToPrint = "";


        public AsyncEscPosPrinter(DeviceConnection printerConnection, int printerDpi, float printerWidthMM, int printerNbrCharactersPerLine) : base(printerDpi, printerWidthMM, printerNbrCharactersPerLine)
        {
            this.printerConnection = printerConnection;
        }

        public DeviceConnection GetPrinterConnection()
        {
            return this.printerConnection;
        }

        public AsyncEscPosPrinter SetTextToPrint(string textToPrint)
        {
            this.textToPrint = textToPrint;
            return this;
        }

        public string GetTextToPrint()
        {
            return this.textToPrint;
        }
    }
}
