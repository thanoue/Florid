using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Florid.Entity
{
    public class ReceiptPrintData : BaseEntity
    {
        [JsonProperty("saleItems")]
        public IList<SaleItem> SaleItems { get; set; }

        [JsonProperty("createdDate")]
        public string CreatedDate { get; set; }

        [JsonProperty("orderId")]
        public string OrderId { get; set; }

        [JsonProperty("summary")]
        public long Summary { get; set; }

        [JsonProperty("totalAmount")]
        public long TotalAmount { get; set; }

        [JsonProperty("totalPaidAmount")]
        public long TotalPaidAmount { get; set; }

        [JsonProperty("totalBalance")]
        public long TotalBalance { get; set; }

        [JsonProperty("vatIncluded")]
        public bool VATIncluded { get; set; }

        [JsonProperty("memberDiscount")]
        public int MemberDiscount { get; set; }

        [JsonProperty("scoreUsed")]
        public double ScoreUsed { get; set; }

        [JsonProperty("gainedScore")]
        public  double GainedScore { get; set; }

        [JsonProperty("totalScore")]
        public double TotalScore { get; set; }

        public ReceiptPrintData()
        {
            SaleItems = new List<SaleItem>();
        }

    }

    public class SaleItem
    {
        [JsonProperty("productName")]
        public string ProductName { get; set; }

        [JsonProperty("index")]
        public int Index { get; set; }

        [JsonProperty("price")]
        public long Price { get; set; }

        [JsonProperty("additionalFee")]
        public long AdditionalFee { get; set; }
    }
}
