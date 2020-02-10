using Florid.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Florid.Core.Service
{
    public interface  IBaseRepository<T> where T : BaseEntity
    {
        string TAG { get;  }
        Task<List<T>> GetAll();

        Task<T> GetById(string id);

        Task Update(T entity);

        Task<T> Insert(T entity);

        Task Delete(T entity);

        Task Delete(string id); 

    }
}
