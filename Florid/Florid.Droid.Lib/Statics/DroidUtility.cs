using System;
using System.Globalization;
using System.IO;
using Android.Content;
using Android.Content.Res;
using Android.Graphics;
using Android.OS;
using Android.Webkit;
using Florid.Model;

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

        public static string BindingReceiptData(this Context context,ReceiptPrintData data)
        {
            AssetManager assets = context.Assets;
            var sr = new StreamReader(assets.Open("receiptTemplate.html"));
            var template = sr.ReadToEnd();

            template = template.Replace("{{OrderId}}", data.OrderId);
            template = template.Replace("{{CreatedDate}}", data.CreatedDate);

            var productTemplate = @"<tr>
                        <td>{0}</td>
                        <td>
                            <p>{1}</p>
                        </td>
                        <td>{2}<span> +{3} </span></td>
   
                       </tr>";

            long saleTotal = 0;
            var saleItemContainer = "";

            foreach (var product in data.SaleItems)
            {
                saleItemContainer += string.Format(productTemplate, product.Index, product.ProductName, product.Price.VNCurrencyFormat(), product.AdditionalFee.VNCurrencyFormat());
                saleTotal += product.Price;
            }

            template = template.Replace("{{SaleItems}}", saleItemContainer);

            template = template.Replace("{{SaleTotal}}", saleTotal.VNCurrencyFormat());
            template = template.Replace("{{TotalAmount}}", data.TotalAmount.VNCurrencyFormat());
            template = template.Replace("{{TotalPaidAmount}}", data.TotalPaidAmount.VNCurrencyFormat());
            template = template.Replace("{{TotalBalance}}", data.TotalBalance.VNCurrencyFormat());

            template = template.Replace("{{VATIncluded}}", data.VATIncluded ? "Đã bao gồm VAT" : "");

            template = template.Replace("{{DiscountPercent}}", data.MemberDiscount.ToString());
            template = template.Replace("{{ScoreUsed}}", data.ScoreUsed.ToString());
            template = template.Replace("{{GainedScore}}", data.GainedScore.ToString());
            template = template.Replace("{{TotalScore}}", data.TotalScore.ToString());

            return template;
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