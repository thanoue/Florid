using System;
using Florid.Entity;

namespace Florid.Schema.Model
{
    public class GenericModel<T> where T: BaseEntity
    {
        public EntityType ModelType { get; set; }
        public T Data { get; set; }

        public GenericModel()
        {
            Data = default(T);
        }
    }

    public enum EntityType
    {
        User,
        Product,
        Customer,
        Order,
    }
}
