﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Florid.Core
{
    public sealed class ServiceLocator
    {
        static readonly Lazy<ServiceLocator> instance = new Lazy<ServiceLocator>(() => new ServiceLocator());
        readonly Dictionary<Type, Lazy<object>> registeredServices = new Dictionary<Type, Lazy<object>>();

        public static ServiceLocator Instance => instance.Value;

        public void Register<TContract, TService>(params object[] args) where TService : new()
        {
            registeredServices[typeof(TContract)] =
                new Lazy<object>(() => Activator.CreateInstance(typeof(TService), args));
        }

        public T Get<T>() where T : class
        {
            Lazy<object> service;
            if (registeredServices.TryGetValue(typeof(T), out service))
            {
                return (T)service.Value;
            }

            return null;
        }
    }
}
