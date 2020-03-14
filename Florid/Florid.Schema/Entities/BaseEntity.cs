using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Florid.Entity
{
    public class BaseEntity
    {
        public string Id { get; set; }
        public bool  Active { get; set; }
        public DateTime Created { get; set; }
        public bool IsDeleted { get; set; }
    }
}
