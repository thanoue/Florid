using Florid.Core.Service;
using Florid.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Florid.Core.Repository
{
    public abstract class BaseRepository<T> : IBaseRepository<T> where T : BaseEntity
    {
        protected abstract string DatabasePath { get; }

        public  abstract string TAG { get; } 

        public abstract Task Delete(T entity);

        public abstract Task Delete(string id);
     
        public abstract Task<List<T>> GetAll();

        public abstract Task<T> GetById(string id);

        public abstract Task<T> Insert(T entity);

        public abstract Task Update(T entity);
      
    }
}
