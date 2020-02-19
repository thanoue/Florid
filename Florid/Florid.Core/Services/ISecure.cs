using System;

namespace Florid.Core.Service
{
    public interface ISecure
    {
        string GetHash(string partnerCode, string merchantRefId,string amount, string paymentCode, string storeId, string storeName, string publicKeyXML);
        string BuildQueryHash(string partnerCode, string merchantRefId,string requestid, string publicKey);
        string BuildRefundHash(string partnerCode, string merchantRefId,string momoTranId, long amount, string description, string publicKey);
        string SignSHA256(string message, string key);
    }
}
