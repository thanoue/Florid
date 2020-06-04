using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace DownloadImage
{
    public class Model
    {
        public string Url { get; set; }
        public string Id { get; set; }
    }

    class MainClass
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
            var count = Download().Result;
        }

        public static async Task<int> Download()
        {
            return await Task<int>.Run(() =>
            {
                try
                {
                    string textFile = "prod.txt";
                    var textContent = File.ReadAllText(textFile);

                    var files = JsonConvert.DeserializeObject<List<Model>>(textContent);

                    foreach (var file in files)
                    {

                        var client = new WebClient();

                        var filePath = Path.Combine("files", file.Id + ".jpg");

                        var url = file.Url;
                        try
                        {

                            var uri = new Uri(url);

                            client.DownloadFile(uri, filePath);
                            Console.WriteLine(filePath);

                        }
                        catch
                        {
                            Console.WriteLine("FAIL: " + url);

                            //try
                            //{
                            //    client.DownloadFile(new Uri(file.Url), filePath);
                            //    Console.WriteLine(filePath);
                            //}
                            //catch
                            //{
                            //    Console.WriteLine("FAIL: " + file.Url);
                            //}
                        }


                    }

                    return files.Count;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                    return 0;
                }


                //foreach (var prod in files)
                //{
                //    var client = new HttpClient();

                //}
            });

        }
    }
}
