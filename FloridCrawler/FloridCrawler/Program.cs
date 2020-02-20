using HtmlAgilityPack;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace FloridCrawler
{
    class Program
    {

        public enum ProductCategories
        {
            Valentine,
            BoHoaTuoi,
            BinhHoaTuoi,
            HopHoaTuoi,
            GioHoaTuoi,
            HoaCuoi,
            HoaNgheThuat,
            KeHoaTuoi,
            HoaSuKien,
            LanHoDiep
        }

        public class Product
        {
            public string Name { get; set; }
            public string Price { get; set; }
            public string ImageUrl { get; set; }
            public ProductCategories ProductCategories { get; set; }

            public int Page { get; set; }

            public Product()
            {

            }
        }

        static  void Main(string[] args)
        {


            //var binhHoaTuoi = Crawl("http://florid.com.vn/binh-hoa-tuoi?page=",6,ProductCategories.BinhHoaTuoi).Result;

            //var hopHoaTuoi = Crawl("http://florid.com.vn/hop-hoa-tuoi?page=", 7, ProductCategories.HopHoaTuoi).Result;

            //var gioHoaTuoi = Crawl("http://florid.com.vn/gio-hoa-tuoi?page=", 4, ProductCategories.GioHoaTuoi).Result;

            var hoaCuoi = Crawl("http://florid.com.vn/hoa-cuoi-1?page=", 1, ProductCategories.HoaCuoi).Result;

            var hoaNgheThuat = Crawl("http://florid.com.vn/hoa-nghe-thuat?page=", 1, ProductCategories.HoaNgheThuat).Result;

            var keHoaTuoi = Crawl("http://florid.com.vn/ke-hoa-tuoi?page=", 3, ProductCategories.KeHoaTuoi).Result;

            var lanHoDiep = Crawl("http://florid.com.vn/lan-ho-diep?page=", 4, ProductCategories.LanHoDiep).Result;

            var products = new List<Product>();
            products.AddRange(hoaCuoi);
            products.AddRange(hoaNgheThuat);
            products.AddRange(keHoaTuoi);
            products.AddRange(lanHoDiep);

            var source = JsonConvert.SerializeObject(products);

            Console.ReadLine();
        }


        private static async Task<List<Product>> Crawl(string baseUrl,int pageCount,ProductCategories productCategories)
        {
            var products = new List<Product>();

            for (int i = 1; i <= pageCount; i++)
            {
                var prods = await CrawlerProduct(baseUrl, i, productCategories);

                products.AddRange(prods);
            }

            return products;
        }


        private static async Task<List<Product>> CrawlerProduct(string baseEndPoint,int page,ProductCategories productCategories)
        {
            var url = baseEndPoint + page;

            var webClient = new WebClient();

            webClient.Encoding = Encoding.UTF8;


            //var client = new HttpClient();
            //client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko");
            var html = await webClient.DownloadStringTaskAsync(url);

            var htmlDoc = new HtmlDocument();


            htmlDoc.LoadHtml(html);

            var divs = htmlDoc.DocumentNode.Descendants("div")
                .Where(node => node.GetAttributeValue("class", "").Equals("item woocommerce-pr-object box-shadow-0 box-shadow-0-hover")).ToList();
            
            var products = new List<Product>();

            foreach(var div in divs)
            {
                var product = new Product();

                var priceSource = div.Descendants("span").FirstOrDefault(node => node.GetAttributeValue("class", "").Equals("product-item-price")).InnerText;
                product.ImageUrl = div.Descendants("img").FirstOrDefault().ChildAttributes("src").FirstOrDefault().Value;
                product.Name = div.Descendants("div").FirstOrDefault(node => node.GetAttributeValue("class", "").Equals("title")).Descendants("a").FirstOrDefault().ChildAttributes("title").FirstOrDefault().Value;
                product.ProductCategories = productCategories;
                product.Page = page;


               // priceSource = priceSource.Substring(0,priceSource.Length-1).Replace(",", "");

                product.Price =priceSource;

                Console.WriteLine("[{0}] : [{1}]", product.Name, product.ImageUrl);

                products.Add(product);
            
            }

            return products;
        }
    }
}
