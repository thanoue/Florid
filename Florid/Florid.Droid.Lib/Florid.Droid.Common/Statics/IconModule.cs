using System;
using System.Collections.Generic;
using Florid.Core;
using Florid.Core.Service;
using Plugin.Iconize;

namespace Florid.Droid.Common
{
    public class IconModule : Plugin.Iconize.IconModule
    {
        public IconModule() : base("AppFontIcons", "AppFontIcons", "FontIcons/appicons.ttf", IconCollection.Icons)
        {

        }
    }

    public static class IconCollection
    {
        public static IList<Icon> Icons { get; } = new List<Icon>();

        private static IContext _contextService => ServiceLocator.Instance.Get<IContext>();

        static IconCollection()
        {
            ((List<Icon>)Icons).AddRange(new List<Icon>()
            {
                new Icon(_contextService.GetStringFromResource(Resource.String.icon_shipping),'\ue900'),
                new Icon(_contextService.GetStringFromResource(Resource.String.icon_user_menu),'\ue917'),
                new Icon(_contextService.GetStringFromResource(Resource.String.icon_flower_menu),'\ue901'),
                new Icon(_contextService.GetStringFromResource(Resource.String.icon_floristing),'\ue902'),
                new Icon(_contextService.GetStringFromResource(Resource.String.icon_filter),'\ue903'),
                new Icon(_contextService.GetStringFromResource(Resource.String.icon_check_list),'\ue904'),
                new Icon(_contextService.GetStringFromResource(Resource.String.icon_to_right_arrow),'\ue906'),
                new Icon(_contextService.GetStringFromResource(Resource.String.icon_user),'\ue907'),
                new Icon(_contextService.GetStringFromResource(Resource.String.icon_remove),'\ue908'),
                new Icon(_contextService.GetStringFromResource(Resource.String.icon_edit),'\ue909'),
                new Icon(_contextService.GetStringFromResource(Resource.String.icon_add),'\ue90a'),
                new Icon(_contextService.GetStringFromResource(Resource.String.icon_flower_thin),'\ue90b'),
                new Icon(_contextService.GetStringFromResource(Resource.String.icon_pictures),'\ue90c'),
                new Icon(_contextService.GetStringFromResource(Resource.String.icon_pictures),'\ue90c'),
                new Icon(_contextService.GetStringFromResource(Resource.String.icon_down_arrow),'\ue90d'),
                new Icon(_contextService.GetStringFromResource(Resource.String.icon_camera),'\ue90e'),
                new Icon(_contextService.GetStringFromResource(Resource.String.icon_customer_service_guy),'\ue90f'),
                new Icon(_contextService.GetStringFromResource(Resource.String.icon_flower),'\ue910'),
                new Icon(_contextService.GetStringFromResource(Resource.String.icon_attach),'\ue911'),
                new Icon(_contextService.GetStringFromResource(Resource.String.icon_shipper),'\ue912'),
                new Icon(_contextService.GetStringFromResource(Resource.String.icon_empty_2),'\ue913'),
                new Icon(_contextService.GetStringFromResource(Resource.String.icon_empty_1),'\ue914'),
                new Icon(_contextService.GetStringFromResource(Resource.String.icon_empty_4),'\ue915'),
                new Icon(_contextService.GetStringFromResource(Resource.String.icon_empty_3),'\ue916'),
                new Icon(_contextService.GetStringFromResource(Resource.String.icon_users_menu),'\ue91b'),
            });
        }

    }
}
