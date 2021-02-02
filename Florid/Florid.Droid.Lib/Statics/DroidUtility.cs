using System;
using System.Globalization;
using System.IO;
using System.Linq;
using Android.Content;
using Android.Content.Res;
using Android.Graphics;
using Android.OS;
using Android.Webkit;
using Florid.Entity;
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

        private static readonly string[] VietnameseSigns = new string[]
          {

                "aAeEoOuUiIdD$yY",

                "áàạảãâấầậẩẫăắằặẳẵ",

                "ÁÀẠẢÃÂẤẦẬẨẪĂẮẰẶẲẴ",

                "éèẹẻẽêếềệểễ",

                "ÉÈẸẺẼÊẾỀỆỂỄ",

                "óòọỏõôốồộổỗơớờợởỡ",

                "ÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠ",

                "úùụủũưứừựửữ",

                "ÚÙỤỦŨƯỨỪỰỬỮ",

                "íìịỉĩ",

                "ÍÌỊỈĨ",

                "đ",

                "Đ",

                "₫",

                "ýỳỵỷỹ",

                "ÝỲỴỶỸ"
          };


        public static string RemoveSign(string str)
        {
            if (string.IsNullOrEmpty(str))
                return "";

            for (int i = 1; i < VietnameseSigns.Length; i++)
            {

                for (int j = 0; j < VietnameseSigns[i].Length; j++)

                    str = str.Replace(VietnameseSigns[i][j], VietnameseSigns[0][i - 1]);
            }

            return str;
        }


        public static string BindingReceiptData(this Context context, ReceiptPrintData data)
        {
            var template = "[L]\n" +
                       "[C]<b><font size='big'>FLORID</font></b>\n" +
                       "[L]\n" +
                       "[C]783 Phan Van Tri,Ward 7, Go Vap\n" +
                       "[C]Ho Chi Minh City, 700000\n" +
                       "[C]Tel: 0931281122\n" +
                       "[C]Facebook: fb.com/floridshop\n" +
                       "[L]\n" +
                       "[C]<b><font size='wide'>RECEIPT</font></b>\n" +
                        "[C]<b><font size='medium'>-----------------------</font></b>\n" +
                       "[C]<b><font size='small'>Id: {{OrderId}}</font></b>\n" +
                       "[C]<b><font size='small'>Time:{{DoneTime}}</font></b>\n" +
                       "[C]<b><font size='medium'>-----------------------</font></b>\n" +
                       "[L]\n" +
                       "[L]   Name[R]Price\n" +

                       "{{SaleItems}}" +

                       "[C]<b><font size='medium'>-----------------------</font></b>\n" +
                       "[L]\n" +

                       "[L]Sum:[R]{{SaleTotal}}\n" +

                       "{{OrderDiscount}}" +

                       "{{VATIncluded}}" +

                       "[L]Amount:[R]{{TotalAmount}}\n" +
                       "[L]Paid:[R]{{TotalPaidAmount}}\n" +
                       "[L]Balance:[R]{{TotalBalance}}\n" +

                       "[C]<b><font size='medium'>-----------------------</font></b>\n" +
                       "{{PurchaseItems}}" +
                       "[C]<b><font size='medium'>-----------------------</font></b>\n" +

                        "{{CustomerInfo}}" +

                        "[L]\n" +
                       "[C]<qrcode size='20'>https://www.facebook.com/floridshop</qrcode>\n" +
                       "[C]<b><font size='medium'>Have a Florid day</font></b>\n" +
                       "[L]\n" +
                       "[L]\n" +
                       "[L]\n";


            template = template.Replace("{{OrderId}}", data.OrderId);
            template = template.Replace("{{DoneTime}}", data.DoneTime);

            var productTemplate = "[L]\n" + "[L]{0}  {1}[R]{2}\n" +
                "[L]   Quantity:[R]{3}\n";

            var productTemplateWithOnlyAdditionalFee = "[L]\n" + "[L]{0}  {1}[R]{2}\n" +
               "[L]   Quantity:[R]{4}\n" +
               "[L]   Shipping Fee:[R]{3}\n";

            var productTemplateWithOnlyDiscount = "[L]\n" + "[L]{0}  {1}[R]{2}\n" +
                "[L]   Quantity:[R]{4}\n" +
                "[L]   Discount:[R]{3}\n";

            var productTemplateWithAdditionalFeeDiscount = "[L]\n" + "[L]{0}  {1}[R]{2}\n"+
                "[L]   Quantity:[R]{5}\n" +
                "[L]   Shipping Fee:[R]{4}\n" +
                "[L]   Discount:[R]{3}\n";


            long saleTotal = 0;
            var saleItemContainer = "";

            data.SaleItems = data.SaleItems.OrderBy(p => p.Index).ToList();

            foreach (var product in data.SaleItems)
            {
                var discount = (long)product.Discount;

                if (data.IsMemberDiscountApply)
                {
                    discount  += (long)((((float)product.Price) / 100f) * data.MemberDiscount);
                }

                if (discount > 0)
                {
                    if (product.AdditionalFee > 0)
                    {
                        saleItemContainer += string.Format(productTemplateWithAdditionalFeeDiscount, product.Index, RemoveSign(product.ProductName), product.Price.VNCurrencyFormat(), discount.VNCurrencyFormat(), product.AdditionalFee.VNCurrencyFormat(),product.Quantity);
                    }
                    else
                    {
                        saleItemContainer += string.Format(productTemplateWithOnlyDiscount, product.Index, RemoveSign(product.ProductName), product.Price.VNCurrencyFormat(), discount.VNCurrencyFormat(), product.Quantity);
                    }
                }
                else
                {
                    if (product.AdditionalFee > 0)
                    {
                        saleItemContainer += string.Format(productTemplateWithOnlyAdditionalFee, product.Index, RemoveSign(product.ProductName), product.Price.VNCurrencyFormat(), product.AdditionalFee.VNCurrencyFormat(), product.Quantity);
                    }
                    else
                    {
                        saleItemContainer += string.Format(productTemplate, product.Index, RemoveSign(product.ProductName), product.Price.VNCurrencyFormat(), product.Quantity);
                    }
                }

                saleTotal += (product.Price * product.Quantity + product.AdditionalFee);
            }

            var beforeVAT = data.VATIncluded ? ((long)(((double)data.TotalAmount) / 1.1d)) : data.TotalAmount;

            var discountTotal = saleTotal - beforeVAT;

            template = template.Replace("{{SaleItems}}", saleItemContainer);

            template = template.Replace("{{SaleTotal}}", saleTotal.VNCurrencyFormat());
            template = template.Replace("{{TotalAmount}}", data.TotalAmount.VNCurrencyFormat());
            template = template.Replace("{{TotalPaidAmount}}", data.TotalPaidAmount.VNCurrencyFormat());
            template = template.Replace("{{TotalBalance}}", data.TotalBalance.VNCurrencyFormat());

            var vatTemplate = "[L]Before VAT:[R]{0}\n";
            template = template.Replace("{{VATIncluded}}", data.VATIncluded ? string.Format(vatTemplate, beforeVAT.VNCurrencyFormat()) : "");

            var customInfoTemplate = "[C]<b><font size='medium'>Customer Information</font></b>\n" +
                       "[L]Name: <b>{{CustomerName}}</b>\n" +
                       "{{MemberDiscount}}" +
                       "[L]Using Scores:[R]{{ScoreUsed}}\n" +
                       "[L]Receipt Scores:[R]{{GainedScore}}\n" +
                       "[L]Total Scores:[R]{{TotalScore}}\n";

            if (string.IsNullOrEmpty(data.CustomerId) || data.CustomerId == "KHACH_LE")
            {
                template = template.Replace("{{CustomerInfo}}", "");
            }
            else
            {
                template = template.Replace("{{CustomerInfo}}", customInfoTemplate);

                template = template.Replace("{{ScoreUsed}}", data.ScoreUsed.ToString());
                template = template.Replace("{{GainedScore}}", data.GainedScore.ToString());
                template = template.Replace("{{TotalScore}}", data.TotalScore.ToString());

                template = template.Replace("{{CustomerName}}", RemoveSign(string.IsNullOrEmpty(data.CustomerName) ? "Khach Le" : data.CustomerName));
            }

            if (discountTotal > 0)
            {
                var discountTeemplate = "[L]Discount Total:[R]{0}\n";

                template = template.Replace("{{OrderDiscount}}", string.Format(discountTeemplate, discountTotal.VNCurrencyFormat()));
            }
            else
                template = template.Replace("{{OrderDiscount}}", "");


            if (data.IsMemberDiscountApply)
            {
                var memberDiscountTemplate = "[L]Member Discount:[R]{0}%\n";

                template = template.Replace("{{MemberDiscount}}", string.Format(memberDiscountTemplate, data.MemberDiscount.ToString()));
            }
            else
                template = template.Replace("{{MemberDiscount}}", "");

            var purchaseTemplate = "[L]{0} [R]{1}\n";

            var purchase = "";

            if (data.PurchaseItems != null && data.PurchaseItems.Any())
            {
                foreach (var item in data.PurchaseItems)
                {
                    purchase += string.Format(purchaseTemplate, item.Method, item.Amount.VNCurrencyFormat());
                }

                template = template.Replace("{{PurchaseItems}}", purchase);
            }
            else
            {
                template = template.Replace("{{PurchaseItems}}", "");
            }


            return template;
        }

        public static string VNCurrencyFormat(this long amount)
        {
            return RemoveSign(amount.ToString("C", CultureInfo.GetCultureInfo("vi-VN")));
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