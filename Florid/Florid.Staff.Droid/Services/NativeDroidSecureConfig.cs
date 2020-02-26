using System;
using Com.Florid.Floridsecurelib;
using Florid.Core.Service;
using Florid.Model;

namespace Florid.Staff.Droid.Services
{
    public class NativeDroidSecureConfig : ISecureConfig
    {
        FirebaseKeys _firebaseConfigs;

        public NativeDroidSecureConfig()
        {
            _firebaseConfigs = new FirebaseKeys();
        }

        public FirebaseConfig GetFirebaseConfig()
        {
            return new FirebaseConfig()
            {
                ApiKey = _firebaseConfigs.ApiKey,
                AuthDomain = _firebaseConfigs.AuthDomain,
                DatabaseURL = _firebaseConfigs.DatabaseURL,
                ProjectId = _firebaseConfigs.ProjectId,
                StorageBucket = _firebaseConfigs.StorageBucket,
                MessagingSenderId = _firebaseConfigs.MessagingSenderId,
                AppId =_firebaseConfigs.AppId,
                MeasurementId = _firebaseConfigs.MeasurementId
            };
        }
    }
}
