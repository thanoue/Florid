using System;
using Newtonsoft.Json;

namespace Florid.Model
{
    public class MomoConfig
    {
        [JsonProperty("partnerCode")]
        public string PartnerCode {get;set;}

        [JsonProperty("storeId")]
        public string StoreId { get; set; }

        [JsonProperty("secretkey")]
        public string Secretkey { get; set; }

        [JsonProperty("accessKey")]
        public string AccessKey { get; set; }

        [JsonProperty("publicKey")]
        public string PublicKey { get; set; }
    }
}
