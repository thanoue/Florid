using System;
using Florid.Enum;

namespace Florid.Entity
{
    public class Product : BaseEntity
    {
        public string Name { get; set; }
        public string Price  { get; set; }
        public string ImageUrl { get; set; }
        public ProductCategories productCategories { get; set; }
        public int Page { get; set; }
    }
}
