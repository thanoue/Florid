using System;
using Newtonsoft.Json;

namespace Florid.Model
{
    public class FirebaseConfig
    {
        [JsonProperty("apiKey")]
        public string ApiKey { get; set; }

        [JsonProperty("authDomain")]
        public string AuthDomain { get; set; }

        [JsonProperty("databaseURL")]
        public string DatabaseURL { get; set; }

        [JsonProperty("projectId")]
        public string ProjectId { get; set; }

        [JsonProperty("storageBucket")]
        public string StorageBucket { get; set; }

        [JsonProperty("messagingSenderId")]
        public string MessagingSenderId { get; set; }

        [JsonProperty("appId")]
        public string AppId { get; set; }

        [JsonProperty("measurementId")]
        public string MeasurementId { get; set; }

        public FirebaseConfig()
        {

        }
    }
}
