using System;
using Florid.Model;

namespace Florid.Core.Service
{
    public interface ISecureConfig
    {
        FirebaseConfig GetFirebaseConfig();

        MomoConfig GetMomoConfig();
    }
}
