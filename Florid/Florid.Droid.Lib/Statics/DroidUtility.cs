using System;
using System.Globalization;
using Android.Graphics;
using Android.OS;
using Android.Webkit;

namespace Florid.Staff.Droid
{ 

    public static class DroidUtility
    {
        public static Bitmap ResizeImage(this Bitmap bitmap, int w, bool ischecked)
        {

            Bitmap BitmapOrg = bitmap;
            Bitmap resizedBitmap = null;
            int width = BitmapOrg.Width;
            int height = BitmapOrg.Height;
            if (width <= w)
            {
                return bitmap;
            }
            if (!ischecked)
            {
                int newWidth = w;
                int newHeight = height * w / width;

                float scaleWidth = ((float)newWidth) / width;
                float scaleHeight = ((float)newHeight) / height;

                Matrix matrix = new Matrix();
                matrix.PostScale(scaleWidth, scaleHeight);
                // if you want to rotate the Bitmap
                // matrix.postRotate(45);
                resizedBitmap = Bitmap.CreateBitmap(BitmapOrg, 0, 0, width,
                        height, matrix, true);
            }
            else
            {
                resizedBitmap = Bitmap.CreateBitmap(BitmapOrg, 0, 0, w, height);
            }

            return resizedBitmap;
        }

        public static string VNCurrencyFormat(this long amount)
        {
            return amount.ToString("C", CultureInfo.GetCultureInfo("vi-vn"));
        }

        public static void ExecJavaScript(WebView webView, string jscode)
        {
            if (webView != null)
            {
                webView.Post(() =>
                {
                    try
                    {
                        if (Build.VERSION.SdkInt >= BuildVersionCodes.Kitkat)
                        {
                            webView.EvaluateJavascript(jscode, null);
                        }
                        else
                        {
                            webView.LoadUrl("javascript:" + jscode);
                        }
                    }
                    catch (Exception e)
                    {
                        // TODO: How to handle exceptions?
                    }
                }
                );
            }
            else
            {
                throw new NullReferenceException("WebView is null!");
            }

        }

    }
}