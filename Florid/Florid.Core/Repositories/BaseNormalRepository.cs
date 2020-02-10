using Florid.Core.Service;
using Florid.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Florid.Core.Repository
{
    public abstract class BaseNormalRepository<T> : BaseRepository<T> where T: BaseEntity
    {
        protected override string DatabasePath => Constants.MAIN_DATABASE_PATH;
    }
}
