using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace FloridCrawler
{
    public class Product
    {
        public string Name { get; set; }
        public double Price { get; set; }
        public string ImageName { get; set; }
        public string Description { get; set; }
        public string Size { get; set; }

        public const string SIZE_S = "S";
        public const string SIZE_M = "M";
        public const string SIZE_L = "L";
    }

    class Program
    {
        static void Main(string[] args)
        {
            //UpdateFileNames();
            //SplitToFolders();
            Rename();
        }

        static string GetSelected(string value, string[] list)
        {
            foreach (var item in list)
            {
                if (Path.GetFileNameWithoutExtension(item).IndexOf(value + ".") == 0)
                {
                    var parts = item.Split('.');
                    if (parts.Length == 3 && parts[1].Length == 1)
                        continue;

                    return item;
                }
            }

            return "";
        }

        static IList<string> RemoveDuplicate(string[] items)
        {
            var newList = new List<string>();
            var newNameList = new List<string>();

            var removalList = new List<string>();
            var removalNameList = new List<string>();

            foreach (var item in items)
            {
                var name = Path.GetFileNameWithoutExtension(item);

                if (newNameList.Contains(name))
                {
                    removalNameList.Add(name);
                    removalList.Add(item);
                }
                else
                {
                    newList.Add(item);
                    newNameList.Add(name);
                }

            }

            return newList;
        }

        static void SplitToFolders()
        {
            var sourceFolderPath = "/Users/sin/Downloads/resize_small/missing/png";
            var sourceFolderFiles = Directory.GetFiles(sourceFolderPath);

            var parts = SplitList<string>(sourceFolderFiles.ToList(), 100);

            var temp = 1;
            foreach (var part in parts)
            {
                var newFolder = Path.Combine("/Users/sin/Downloads/resize_small/missing/png", temp.ToString());

                Directory.CreateDirectory(newFolder);

                foreach (var item in part)
                {
                    File.Copy(item, Path.Combine(newFolder, Path.GetFileName(item)));
                }

                temp += 1;

                Console.WriteLine(newFolder);
            }
        }

        static void Rename()
        {
            var sourceFolderPath = "/Users/sin/Downloads/resized_products";
            var sourceFolderFiles = Directory.GetFiles(sourceFolderPath);

            var destFolderPath = "/Users/sin/GoogleDrive/anh_san_pham";
            var destFolderFiles = Directory.GetFiles(destFolderPath);

            foreach (var item in sourceFolderFiles)
            {
                var fileName = Path.GetFileNameWithoutExtension(item);
                var ext = Path.GetExtension(item);

                if (fileName.IndexOf('.') > -1)
                    continue;

                var selected = GetSelected(fileName, destFolderFiles);

                if (!string.IsNullOrEmpty(selected))
                {
                    var folderPath = Path.GetDirectoryName(item);
                    var newName = Path.Combine(folderPath, Path.GetFileNameWithoutExtension(selected) + ext);
                    try
                    {

                        File.Move(item, newName);
                    }
                    catch
                    {

                        Console.WriteLine("ERROR: {0} -> {1}", fileName, Path.GetFileNameWithoutExtension(selected));

                    }

                    Console.WriteLine("{0} -> {1}", fileName, Path.GetFileNameWithoutExtension(selected));

                }
            }
        }


        static void UpdateFileNames()
        {
            var sourceFolderPath = "/Users/sin/Downloads/resized_products";
            var sourceFolderFiles = Directory.GetFiles(sourceFolderPath);

            var destFolderPath = "/Users/sin/GoogleDrive/anh_san_pham";
            var destFolderFiles = Directory.GetFiles(destFolderPath);

            var list = new List<Product>();

            var newList = RemoveDuplicate(sourceFolderFiles);

            for (var i = 0; i < newList.Count; i++)
            {
                var fileName = Path.GetFileNameWithoutExtension(newList[i]);
                var ext = Path.GetExtension(newList[i]);

                if (fileName.IndexOf(".") < 0)
                {
                    var selected = GetSelected(fileName, destFolderFiles);

                    if (!string.IsNullOrEmpty(selected))
                    {
                        list.AddRange(GetProductsFromName(Path.GetFileNameWithoutExtension(selected), ext));

                        Console.WriteLine("{0} -> {1}", fileName, Path.GetFileNameWithoutExtension(selected));
                        continue;
                    }

                    var prod = new Product()
                    {
                        Description = "",
                        Name = fileName,
                        ImageName = fileName + ext,
                        Size = Product.SIZE_M,
                        Price = 0
                    };

                    list.Add(prod);
                }
                else
                {
                    list.AddRange(GetProductsFromName(fileName, ext, true));
                    Console.WriteLine("Is full infor: {0}", fileName);
                }
            }

            var parts = SplitList<Product>(list, 300);

            var temp = 0;
            foreach (var item in parts)
            {
                var name = string.Format("product_{0}.json", temp);

                File.WriteAllText(Path.Combine("/Users/sin/Downloads", name), JsonConvert.SerializeObject(item));

                temp += 1;
            }


            Console.ReadKey();
        }

        public static IEnumerable<List<T>> SplitList<T>(List<T> locations, int nSize = 30)
        {
            for (int i = 0; i < locations.Count; i += nSize)
            {
                yield return locations.GetRange(i, Math.Min(nSize, locations.Count - i));
            }
        }

        static IList<Product> GetProductsFromName(string name, string ext, bool nameIsFull = false)
        {
            var parts = name.Split('.');
            var fileName = nameIsFull ? name : parts.Length > 0 ? parts[0] : name;

            var prods = new List<Product>();

            for (var j = 1; j < parts.Length; j++)
            {
                var product = new Product();

                var index = parts[j].IndexOf(' ');

                var priceString = index > 0 ? parts[j].Remove(index) : parts[j];

                product.Description = index > 0 ? parts[j].Substring(index).Trim().Replace("(", "").Replace(")", "") : "";

                if (double.TryParse(priceString, out double price))
                {
                    product.Price = price;
                }
                else
                    product.Price = 0;

                product.ImageName = fileName + ext;
                product.Name = fileName;

                if (!string.IsNullOrEmpty(product.Description))
                {
                    Console.WriteLine("{0} - {1} - {2}", product.Name, product.Description, product.Price);
                }

                prods.Add(product);
            }

            if (prods.Count < 1)
            {
                var prod = new Product()
                {
                    Description = "",
                    Name = fileName,
                    ImageName = fileName + ext,
                    Size = Product.SIZE_M
                };

                prod.Price = 0;

                prods.Add(prod);
            }

            prods = prods.OrderBy(p => p.Price).ToList();

            if (prods.Count >= 3)
            {
                prods[0].Size = Product.SIZE_S;
                prods[1].Size = Product.SIZE_M;
                prods[2].Size = Product.SIZE_L;
            }
            else
            {
                if (prods.Count >= 2)
                {
                    prods[0].Size = Product.SIZE_M;
                    prods[1].Size = Product.SIZE_L;
                }
                else
                {
                    prods[0].Size = Product.SIZE_M;
                }
            }

            return prods;
        }


    }
}
