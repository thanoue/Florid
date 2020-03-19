using System;
using Com.Florid.Floridsecurelib;
using Florid.Core.Service;
using Florid.Model;

namespace Florid.Staff.Droid.Services
{
    public class NativeDroidSecureConfig : ISecureConfig
    {
        FirebaseKeys _firebasenativeConfigs;
        MomoKeys _momoNativeCongigs;


        FirebaseConfig _firebaseConfig;
        MomoConfig _momoConfig;

        public NativeDroidSecureConfig()
        {
            _firebasenativeConfigs = new FirebaseKeys();
            _momoNativeCongigs = new MomoKeys();
        }

        public FirebaseConfig GetFirebaseConfig()
        {
            if(_firebaseConfig == null)
            {
                _firebaseConfig = new FirebaseConfig()
                {
                    ApiKey = _firebasenativeConfigs.ApiKey,
                    AuthDomain = _firebasenativeConfigs.AuthDomain,
                    DatabaseURL = _firebasenativeConfigs.DatabaseURL,
                    ProjectId = _firebasenativeConfigs.ProjectId,
                    StorageBucket = _firebasenativeConfigs.StorageBucket,
                    MessagingSenderId = _firebasenativeConfigs.MessagingSenderId,
                    AppId = _firebasenativeConfigs.AppId,
                    MeasurementId = _firebasenativeConfigs.MeasurementId
                };
            }

            return _firebaseConfig;
        }

        public MomoConfig GetMomoConfig()
        {
            if(_momoConfig == null)
            {
                _momoConfig = new MomoConfig()
                {
                    AccessKey = _momoNativeCongigs.AccessKey,
                    PartnerCode = _momoNativeCongigs.PartnerCode,
                    PublicKey = _momoNativeCongigs.PublicKey,
                    Secretkey = _momoNativeCongigs.SecretKey,
                    StoreId = _momoNativeCongigs.StoreId
                };
            }
            return _momoConfig;
        }
    }
}
