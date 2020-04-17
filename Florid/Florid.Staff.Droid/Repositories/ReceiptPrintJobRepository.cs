using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Florid.Core.Service;
using Florid.Entity;
using Florid.Staff.Droid.Repositories;

namespace Florid.Staff.Droid.Repository
{
    public class ReceiptPrintJobRepository : BaseNormalDroidRepository<ReceiptPrintData>,IReceiptPrintJobRepository
    {
        public override string TAG => "printJobs";

        public ReceiptPrintJobRepository()
        {
        }

    }
}