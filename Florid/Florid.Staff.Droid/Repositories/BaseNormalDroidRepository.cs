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
using Firebase.Database;
using Firebase.Database.Query;
using Florid.Core;
using Florid.Core.Repository;
using Florid.Entity;

namespace Florid.Staff.Droid.Repositories
{
    public abstract class BaseNormalDroidRepository<T> : BaseNormalRepository<T> where T : BaseEntity
    {
        protected FirebaseClient FirebaseClient;

        public BaseNormalDroidRepository()
        {
            FirebaseClient = new FirebaseClient(DatabasePath);
        }

        public override async Task<List<T>> GetAll()
        {
            return (await FirebaseClient
                     .Child(TAG)
                     .OnceAsync<T>()).Select(item => item.Object).ToList();
        }

        public override async Task Delete(T entity)
        {
            await FirebaseClient.Child(TAG).Child(entity.Id).DeleteAsync();
        }

        public override async Task Delete(string id)
        {
            await FirebaseClient.Child(TAG).Child(id).DeleteAsync();
        }

        public override async Task<T> GetById(string id)
        {
            return (await FirebaseClient
            .Child(TAG)
            .Child(id)
            .OnceSingleAsync<T>());
        }

        public override async Task<T> Insert(T entity)
        {
            var obj = await FirebaseClient
             .Child(TAG)
             .PostAsync<T>(entity, true);

            entity.Id = obj.Key;

            return await Update(entity).ContinueWith<T>((res) =>
            {
                return entity;
            });
        }

        public override async Task Update(T entity)
        {
            await FirebaseClient
          .Child(TAG)
          .Child(entity.Id)
          .PutAsync(entity);
        }
    }
}