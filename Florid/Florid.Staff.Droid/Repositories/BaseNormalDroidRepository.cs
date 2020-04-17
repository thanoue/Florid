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
using Florid.Core.Service;
using Florid.Entity;

namespace Florid.Staff.Droid.Repositories
{
    public abstract class BaseNormalDroidRepository<T> : BaseRepository<T> where T : BaseEntity
    {
        protected INormalDBSession<FirebaseClient> DBSession => ServiceLocator.Instance.Get<INormalDBSession<FirebaseClient>>();

        protected FirebaseClient Client => DBSession.Client;

        public BaseNormalDroidRepository()
        {

        }

        public override async Task<List<T>> GetAll()
        {
            return (await Client
                     .Child(TAG)
                     .OnceAsync<T>()).Select(item => item.Object).ToList();
        }

        public override async Task Delete(T entity)
        {
            await Client.Child(TAG).Child(entity.Id).DeleteAsync();

        }

        public override async Task Delete(string id)
        {
            await Client.Child(TAG).Child(id).DeleteAsync();
        }

        public override async Task<T> GetById(string id)
        {
            return (await Client
                       .Child(TAG)
                       .Child(id)
                       .OnceSingleAsync<T>());
        }

        public override async Task<T> Insert(T entity)
        {
            var obj = await Client
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
            await Client
                     .Child(TAG)
                     .Child(entity.Id)
                     .PutAsync(entity);
        }

        public override void ItemAddedRegister(Action<T> newDataCallback)
        {
            var register = Client.Child(TAG)
                                    .AsObservable<T>()
                                    .Subscribe(d =>
                                    {
                                        if (d.EventType == Firebase.Database.Streaming.FirebaseEventType.InsertOrUpdate)
                                        {
                                            newDataCallback?.Invoke(d.Object);
                                        }
                                    });

            DBSession.AddHandle(register);
        }
    }
}