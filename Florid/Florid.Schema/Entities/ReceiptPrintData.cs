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
        public long Summary { get; set; } = 0;

        [JsonProperty("totalAmount")]
        public long TotalAmount { get; set; } = 0;

        [JsonProperty("totalPaidAmount")]
        public long TotalPaidAmount { get; set; } = 0;

        [JsonProperty("totalBalance")]
        public long TotalBalance { get; set; } = 0;

        [JsonProperty("vatIncluded")]
        public bool VATIncluded { get; set; }

        [JsonProperty("memberDiscount")]
        public int MemberDiscount { get; set; } = 0;

        [JsonProperty("scoreUsed")]
        public double ScoreUsed { get; set; } = 0;

        [JsonProperty("gainedScore")]
        public  double GainedScore { get; set; } = 0;

        [JsonProperty("totalScore")]
        public double TotalScore { get; set; } = 0;

        [JsonProperty("customerName")]
        public string CustomerName { get; set; }

       [JsonProperty("discount")]
        public long Discount { get; set; } = 0;

        [JsonProperty("customerId")]
        public string CustomerId { get; set; };

        [JsonProperty("purchaseItems")]
        public IList<PurchaseItem> PurchaseItems { get; set; }

        public ReceiptPrintData()
        {
            SaleItems = new List<SaleItem>();
            PurchaseItems = new List<PurchaseItem>();
        }
    }

    public class PurchaseItem
    {
        [JsonProperty("method")]
        public string Method { get; set; }

        [JsonProperty("amount")]
        public long Amount { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }
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

        [JsonProperty("discount")]
        public double Discount { get; set; }
    }
}
