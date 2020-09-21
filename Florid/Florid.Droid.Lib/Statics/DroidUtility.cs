using System;
using System.Globalization;
using System.IO;
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

        public static string BindingReceiptData(this Context context, ReceiptPrintData data)
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
                        <td>{2}</td>
   
                       </tr>";

            var productTemplateWithOnlyAdditionalFee = @"<tr>
                        <td>{0}</td>
                        <td>
                            <p>{1}</p>
                        </td>
                        <td>{2}</td>
   
                       </tr><tr>
                        <td></td>
                        <td>
                            <p>Phụ phí:</p>
                        </td>
                        <td>{3}</td>
   
                       </tr>";

            var productTemplateWithOnlyDiscount = @"
                      <tr>
                        <td>{0}</td>
                        <td>
                            <p>{1}</p>
                        </td>
                        <td>{2}</td>
   
                      </tr>
                      <tr>
                        <td></td>
                        <td>
                            <p>Giảm giá:</p>
                        </td>
                        <td>{3}</td>
   
                       </tr>";
            
            var productTemplateWithAdditionalFeeDiscount = @"
                       <tr>
                        <td>{0}</td>
                        <td>
                            <p>{1}</p>
                        </td>
                        <td>{2}</td>
   
                       </tr>

                       <tr>
                        <td></td>
                        <td>
                            <p>Giảm giá:</p>
                        </td>
                        <td>{3}</td>
                       </tr>

                       <tr>
                        <td></td>
                        <td>
                            <p>Phụ phí:</p>
                        </td>
                        <td>{4}</td>
                       </tr>";



            long saleTotal = 0;
            var saleItemContainer = "";

            bool isHasMemberDiscount = true;

            if (data.Discount > 0)
                isHasMemberDiscount = false;

            foreach(var prod in data.SaleItems)
            {
                if(prod.Discount > 0)
                {
                    isHasMemberDiscount = false;
                    break;
                }
            }

            foreach (var product in data.SaleItems)
            {
                var discount = (long)product.Discount;

                if (isHasMemberDiscount)
                {
                    discount =(long)((((float)product.Price) / 100f) * data.MemberDiscount);
                }

                if(discount > 0)
                {
                    if(product.AdditionalFee > 0)
                    {
                        saleItemContainer += string.Format(productTemplateWithAdditionalFeeDiscount, product.Index, product.ProductName, product.Price.VNCurrencyFormat(),discount.VNCurrencyFormat(), product.AdditionalFee.VNCurrencyFormat());
                    }
                    else
                    {
                        saleItemContainer += string.Format(productTemplateWithOnlyDiscount, product.Index, product.ProductName, product.Price.VNCurrencyFormat(), discount.VNCurrencyFormat());
                    }
                }
                else
                {
                    if (product.AdditionalFee > 0)
                    {
                        saleItemContainer += string.Format(productTemplateWithOnlyAdditionalFee, product.Index, product.ProductName, product.Price.VNCurrencyFormat(), product.AdditionalFee.VNCurrencyFormat());
                    }
                    else
                    {
                        saleItemContainer += string.Format(productTemplate, product.Index, product.ProductName, product.Price.VNCurrencyFormat());
                    }
                }

                saleTotal += product.Price;

                if (product.Discount > 0)
                    isHasMemberDiscount = false;
            }

          
            template = template.Replace("{{SaleItems}}", saleItemContainer);

            template = template.Replace("{{SaleTotal}}", saleTotal.VNCurrencyFormat());
            template = template.Replace("{{TotalAmount}}", data.TotalAmount.VNCurrencyFormat());
            template = template.Replace("{{TotalPaidAmount}}", data.TotalPaidAmount.VNCurrencyFormat());
            template = template.Replace("{{TotalBalance}}", data.TotalBalance.VNCurrencyFormat());

            template = template.Replace("{{VATIncluded}}", data.VATIncluded ? "Đã bao gồm VAT" : "");

            template = template.Replace("{{ScoreUsed}}", data.ScoreUsed.ToString());
            template = template.Replace("{{GainedScore}}", data.GainedScore.ToString());
            template = template.Replace("{{TotalScore}}", data.TotalScore.ToString());
            template = template.Replace("{{CustomerName}}", data.CustomerName);

            if (data.Discount > 0)
            {
                var discountTeemplate = @"<tr>
                        <td>Giảm giá:</td>
                        <td>{0}</td>
                    </tr>";

                template = template.Replace("{{OrderDiscount}}", string.Format(discountTeemplate, data.Discount.VNCurrencyFormat()));
            }
            else
                template = template.Replace("{{OrderDiscount}}", "");


            if (isHasMemberDiscount)
            {
                var memberDiscountTemplate = @" <tr>
                        <td>Giảm giá thành viên</td>
                        <td>{0}%</td>
                    </tr>";

                template = template.Replace("{{MemberDiscount}}", string.Format(memberDiscountTemplate, data.MemberDiscount.ToString()));
            }
            else
                template = template.Replace("{{MemberDiscount}}", "");

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