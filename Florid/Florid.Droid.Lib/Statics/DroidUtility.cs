﻿using System;
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

            for (int i = 1; i < VietnameseSigns.Length; i++)
            {

                for (int j = 0; j < VietnameseSigns[i].Length; j++)

                    str = str.Replace(VietnameseSigns[i][j], VietnameseSigns[0][i - 1]);
            }

            return str;
        }


        public static string BindingReceiptData(this Context context, ReceiptPrintData data)
        {
            AssetManager assets = context.Assets;
            var sr = new StreamReader(assets.Open("receiptTemplate.html"));
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
                       "[C]<b><font size='small'>Time:{{CreatedDate}}</font></b>\n" +
                        "[C]<b><font size='medium'>-----------------------</font></b>\n" +
                       "[L]\n" +
                       "[L]   Name[R]Price\n" +

                       "{{SaleItems}}" +

                       "[C]<b><font size='medium'>-----------------------</font></b>\n" +
                       "[L]\n" +

                       "[L]Sum:[R]{{SaleTotal}}\n" +
                       "{{OrderDiscount}}" +
                       "[L]Amount:[R]{{TotalAmount}}\n" +
                       "[L]Paid:[R]{{TotalPaidAmount}}\n" +
                       "[L]Balance:[R]{{TotalBalance}}\n" +

                       "[C]<b><font size='medium'>{{VATIncluded}}</font></b>\n" +

                       "[C]<b><font size='medium'>-----------------------</font></b>\n" +
                       "{{PurchaseItems}}"+
                       "[C]<b><font size='medium'>-----------------------</font></b>\n" +

                       "[C]<b><font size='medium'>Customer Information</font></b>\n" +
                       "[L]Name: <b>{{CustomerName}}</b>\n" +
                       "{{MemberDiscount}}" +
                       "[L]Using Scores:[R]{{ScoreUsed}}\n" +
                       "[L]Receipt Scores:[R]{{GainedScore}}\n" +
                       "[L]Total Scores:[R]{{TotalScore}}\n" +

                        "[L]\n" +
                       "[C]<qrcode size='20'>https://www.facebook.com/floridshop</qrcode>\n" +
                       "[C]<b>Have a florid day!</b>" +
                       "[L]\n"+
                       "[L]\n"+
                       "[L]\n";


            template = template.Replace("{{OrderId}}", data.OrderId);
            template = template.Replace("{{CreatedDate}}", data.CreatedDate);

            var productTemplate = "[L]\n" + "[L]{0}  {1}[R]{2}\n";

            var productTemplateWithOnlyAdditionalFee = "[L]\n" + "[L]{0}  {1}[R]{2}\n" +
                "[R]+{3}\n";

            var productTemplateWithOnlyDiscount = "[L]\n" + "[L]{0}  {1}[R]{2}\n" +
                       "[L]   Discount:[R]{3}\n";

            var productTemplateWithAdditionalFeeDiscount = "[L]\n" + "[L]{0}  {1}[R]{2}\n" + "[R]+{4}\n" +
            "[L]   Discount:[R]{3}\n";


            long saleTotal = 0;
            var saleItemContainer = "";

            bool isHasMemberDiscount = true;

            if (data.Discount > 0)
                isHasMemberDiscount = false;

            foreach (var prod in data.SaleItems)
            {
                if (prod.Discount > 0)
                {
                    isHasMemberDiscount = false;
                    break;
                }
            }

            data.SaleItems = data.SaleItems.OrderBy(p => p.Index).ToList();

            foreach (var product in data.SaleItems)
            {
                var discount = (long)product.Discount;

                if (isHasMemberDiscount)
                {
                    discount = (long)((((float)product.Price) / 100f) * data.MemberDiscount);
                }

                if (discount > 0)
                {
                    if (product.AdditionalFee > 0)
                    {
                        saleItemContainer += string.Format(productTemplateWithAdditionalFeeDiscount, product.Index, RemoveSign(product.ProductName), product.Price.VNCurrencyFormat(), discount.VNCurrencyFormat(), product.AdditionalFee.VNCurrencyFormat());
                    }
                    else
                    {
                        saleItemContainer += string.Format(productTemplateWithOnlyDiscount, product.Index, RemoveSign(product.ProductName), product.Price.VNCurrencyFormat(), discount.VNCurrencyFormat());
                    }
                }
                else
                {
                    if (product.AdditionalFee > 0)
                    {
                        saleItemContainer += string.Format(productTemplateWithOnlyAdditionalFee, product.Index, RemoveSign(product.ProductName), product.Price.VNCurrencyFormat(), product.AdditionalFee.VNCurrencyFormat());
                    }
                    else
                    {
                        saleItemContainer += string.Format(productTemplate, product.Index, RemoveSign(product.ProductName), product.Price.VNCurrencyFormat());
                    }
                }

                saleTotal += product.Price;
            }


            template = template.Replace("{{SaleItems}}", saleItemContainer);

            template = template.Replace("{{SaleTotal}}", saleTotal.VNCurrencyFormat());
            template = template.Replace("{{TotalAmount}}", data.TotalAmount.VNCurrencyFormat());
            template = template.Replace("{{TotalPaidAmount}}", data.TotalPaidAmount.VNCurrencyFormat());
            template = template.Replace("{{TotalBalance}}", data.TotalBalance.VNCurrencyFormat());

            template = template.Replace("{{VATIncluded}}", data.VATIncluded ? "VAT is Included" : "");

            template = template.Replace("{{ScoreUsed}}", data.ScoreUsed.ToString());
            template = template.Replace("{{GainedScore}}", data.GainedScore.ToString());
            template = template.Replace("{{TotalScore}}", data.TotalScore.ToString());
            template = template.Replace("{{CustomerName}}", RemoveSign(data.CustomerName));

            if (data.Discount > 0)
            {
                var discountTeemplate = "[L]Discount Total:[R]{0}\n";

                template = template.Replace("{{OrderDiscount}}", string.Format(discountTeemplate, data.Discount.VNCurrencyFormat()));
            }
            else
                template = template.Replace("{{OrderDiscount}}", "");


            if (isHasMemberDiscount)
            {
                var memberDiscountTemplate = "[L]Member Discount:[R]{0}%\n";

                template = template.Replace("{{MemberDiscount}}", string.Format(memberDiscountTemplate, data.MemberDiscount.ToString()));
            }
            else
                template = template.Replace("{{MemberDiscount}}", "");

            var purchaseTemplate = "[L]{0} [R]{1}\n";

            var purchase = "";

            foreach(var item in data.PurchaseItems)
            {
                purchase += string.Format(purchaseTemplate, item.Method, item.Amount.VNCurrencyFormat());
            }

            template  = template.Replace("{{PurchaseItems}}", purchase);

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