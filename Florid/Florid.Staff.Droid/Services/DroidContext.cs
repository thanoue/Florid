using System;
using Android.Content;
using Florid.Core.Service;

namespace Florid.Staff.Droid.Service
{
    public class DroidContext : IContext
    {
        Context _context;

        public DroidContext()
        {
        }

        public DroidContext(Context context)
        {
            _context = context;
        }

        public string GetStringFromResource(int resId)
        {
            return _context.Resources.GetString(resId);
        }

    }
}
