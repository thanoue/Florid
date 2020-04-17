using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Florid.Core.Service
{
    public interface IDBSession<T> where T :class
    {
        T Client { get; }
        T Authenticate(string token);
        void Logout();
        void AddHandle(IDisposable handle);
    }

    public interface INormalDBSession<T> : IDBSession<T> where T: class
    {

    }

}
