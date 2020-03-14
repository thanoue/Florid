using System;
using Android.Webkit;

namespace Florid.Droid.Lib
{
    public class MyWebChromeClient : WebChromeClient
    {
        public MyWebChromeClient()
        {
        }

        [Obsolete]
        public override void OnConsoleMessage(string message, int lineNumber, string sourceID)
        {
            base.OnConsoleMessage(message, lineNumber, sourceID);
        }
    }
}
