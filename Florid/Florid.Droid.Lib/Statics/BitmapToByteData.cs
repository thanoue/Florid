using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.Graphics;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;

namespace Florid.Droid.Lib.Static
{
    public static class BitmapToByteData
    {
        public enum BmpType
        {
            Dithering = 1,
            Threshold = 2
        }

        public enum AlignType
        {
            Left = 1,
            Center = 2,
            Right = 3
        }


        private static Bitmap ToGrayscale(Bitmap bmpOriginal)
        {
            int height = bmpOriginal.Height;
            int width = bmpOriginal.Width;
            Bitmap bmpGrayscale = Bitmap.CreateBitmap(width, height, Bitmap.Config.Rgb565);
            Canvas c = new Canvas(bmpGrayscale);
            Paint paint = new Paint();
            ColorMatrix cm = new ColorMatrix();
            cm.SetSaturation(0.0F);
            ColorMatrixColorFilter f = new ColorMatrixColorFilter(cm);
            paint.SetColorFilter(f);
            c.DrawBitmap(bmpOriginal, 0.0F, 0.0F, paint);
            return bmpGrayscale;
        }

        private static Bitmap ConvertGreyImg(Bitmap img)
        {
            int width = img.Width;
            int height = img.Height;
            int[] pixels = new int[width * height];
            img.GetPixels(pixels, 0, width, 0, 0, width, height);
            double redSum = 0.0D;
            double total = (double)(width * height);

            int m;
            int i;
            int j;
            int grey;

            for (m = 0; m < height; ++m)
            {
                for (i = 0; i < width; ++i)
                {
                    j = pixels[width * m + i];
                    grey = (j & 16711680) >> 16;
                    redSum += (double)grey;
                }
            }

            m = (int)(redSum / total);

            for (i = 0; i < height; ++i)
            {
                for (j = 0; j < width; ++j)
                {
                    grey = pixels[width * i + j];
                    int alpha1 = -16777216;
                    var red = ((grey & 16711680) >> 16);
                    var green = ((grey & '\uff00') >> 8);
                    var blue = (grey & 255);

                    if (red >= m)
                    {
                        blue = 255;
                        green = 255;
                        red = 255;
                    }
                    else
                    {
                        blue = 0;
                        green = 0;
                        red = 0;
                    }

                    grey = alpha1 | red << 16 | green << 8 | blue;
                    pixels[width * i + j] = grey;
                }
            }

            Bitmap mBitmap = Bitmap.CreateBitmap(width, height, Bitmap.Config.Rgb565);
            mBitmap.SetPixels(pixels, 0, width, 0, 0, width, height);
            return mBitmap;
        }

        private static Bitmap ConvertGreyImgByFloyd(Bitmap img)
        {
            int width = img.Width;
            int height = img.Height;
            int[] pixels = new int[width * height];
            img.GetPixels(pixels, 0, width, 0, 0, width, height);
            int[] gray = new int[height * width];

            int e;
            int i;
            int j;
            int g;

            for (e = 0; e < height; e++)
            {
                for (i = 0; i < width; i++)
                {
                    j = pixels[width * e + i];
                    g = (j & 16711680) >> 16;
                    gray[width * e + i] = g;
                }
            }

            e = 0;

            for (i = 0; i < height; i++)
            {
                for (j = 0; j < width; j++)
                {
                    g = gray[width * i + j];
                    if (g >= 128)
                    {
                        pixels[width * i + j] = -1;
                        e = g - 255;
                    }
                    else
                    {
                        pixels[width * i + j] = -16777216;
                        e = g - 0;
                    }

                    if (j < width - 1 && i < height - 1)
                    {
                        gray[width * i + j + 1] += 3 * e / 8;
                        gray[width * (i + 1) + j] += 3 * e / 8;
                        gray[width * (i + 1) + j + 1] += e / 4;
                    }
                    else if (j == width - 1 && i < height - 1)
                    {
                        gray[width * (i + 1) + j] += 3 * e / 8;
                    }
                    else if (j < width - 1 && i == height - 1)
                    {
                        gray[width * i + j + 1] += e / 4;
                    }
                }
            }

            Bitmap mBitmap = Bitmap.CreateBitmap(width, height, Bitmap.Config.Rgb565);
            mBitmap.SetPixels(pixels, 0, width, 0, 0, width, height);
            return mBitmap;
        }

        private static byte[] Getbmpdata(int[] b, int w, int h)
        {
            int n = (w + 7) / 8;
            byte[] data = new byte[n * h];
            byte mask = 1;

            int y = 0;
            for (y = 0; y < h; y++)
            {
                for (int x = 0; x < n * 8; x++)
                {
                    if (x < w)
                    {
                        if ((b[y * w + x] & 16711680) >> 16 != 0)
                        {
                            data[y * n + x / 8] |= (byte)(mask << 7 - x % 8);
                        }
                    }
                    else if (x >= w)
                    {
                        data[y * n + x / 8] |= (byte)(mask << 7 - x % 8);
                    }
                }
            }

            for (y = 0; y < data.Length; y++)
            {
                data[y] = (byte)(~data[y]);
            }

            return data;
        }

        public static byte[] SetAbsolutePrintPosition(int m, int n)
        {
            byte[] data = new byte[] { 27, 36, (byte)m, (byte)n };
            return data;
        }


        public static byte[] RasterBmpToSendData(int m, Bitmap mBitmap, BmpType bmpType, AlignType alignType, int pagewidth)
        {
            Bitmap bitmap = ToGrayscale(mBitmap);

            switch ((int)bmpType)
            {
                case 1:
                    bitmap = ConvertGreyImg(bitmap);
                    break;
                case 2:
                    bitmap = ConvertGreyImgByFloyd(bitmap);
                    break;
                default:
                    bitmap = ConvertGreyImg(bitmap);
                    break;
            }

            int width = bitmap.Width;
            int height = bitmap.Height;
            int[] pixels = new int[width * height];
            bitmap.GetPixels(pixels, 0, width, 0, 0, width, height);
            byte[] data = Getbmpdata(pixels, width, height);
            int n = (width + 7) / 8;
            byte xL = (byte)(n % 256);
            byte xH = (byte)(n / 256);
            int x = (height + 23) / 24;

            List<Byte> list = new List<Byte>();

            byte[] head = new byte[] { 29, 118, 48, (byte)m, xL, xH, 24, 0 };
            int mL = 0;
            int mH = 0;
            if (width >= pagewidth)
            {
                alignType = BitmapToByteData.AlignType.Left;
            }

            switch ((int)alignType)
            {
                case 1:
                    mL = 0;
                    mH = 0;
                    break;
                case 2:
                    mL = (pagewidth - width) / 2 % 256;
                    mH = (pagewidth - width) / 2 / 256;
                    break;
                case 3:
                    mL = (pagewidth - width) % 256;
                    mH = (pagewidth - width) / 256;
                    break;
            }

            byte[] aligndata = SetAbsolutePrintPosition(mL, mH);

            for (int i = 0; i < x; ++i)
            {
                byte[] newdata;
                if (i == x - 1)
                {
                    if (height % 24 == 0)
                    {
                        head[6] = 24;
                        newdata = new byte[n * 24];
                        Java.Lang.JavaSystem.Arraycopy(data, 24 * i * n, newdata, 0, 24 * n);
                    }
                    else
                    {
                        head[6] = (byte)(height % 24);
                        newdata = new byte[height % 24 * n];
                        Java.Lang.JavaSystem.Arraycopy(data, 24 * i * n, newdata, 0, height % 24 * n);
                    }
                }
                else
                {
                    newdata = new byte[n * 24];
                    Java.Lang.JavaSystem.Arraycopy(data, 24 * i * n, newdata, 0, 24 * n);
                }

                byte b;
                int var22;
                int var23;
                byte[] var24;
                if (alignType != BitmapToByteData.AlignType.Left)
                {
                    var24 = aligndata;
                    var23 = aligndata.Length;

                    for (var22 = 0; var22 < var23;var22++)
                    {
                        b = var24[var22];
                        list.Add(b);
                    }
                }

                var24 = head;
                var23 = head.Length;

                for (var22 = 0; var22 < var23; var22++)
                {
                    b = var24[var22];
                    list.Add(b);
                }

                var24 = newdata;
                var23 = newdata.Length;

                for (var22 = 0; var22 < var23; var22++)
                {
                    b = var24[var22];
                    list.Add(b);
                }
            }

            Byte[] byteData = new Byte[list.Count];

            for (int i = 0; i < byteData.Length; i++)
            {
                byteData[i] = (Byte)list[i];
            }

            return byteData;
        }

    }
}