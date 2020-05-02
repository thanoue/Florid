export enum EntityType {
    User,
    Product,
    Customer,
    Order,
}


export enum Roles {
    Admin = 'Admin',
    Account = 'Account',
    Shipper = 'Shipper',
    Florist = 'Florist'
};

export enum ProductCategories {
    All = -1,
    Valentine = 0,
    BoHoaTuoi,
    BinhHoaTuoi,
    HopHoaTuoi,
    GioHoaTuoi,
    HoaCuoi,
    HoaNgheThuat,
    KeHoaTuoi,
    HoaSuKien,
    LanHoDiep
}

export enum MembershipTypes {
    NewCustomer,
    StandardMember,
    VipMember,
    VVipMember
}

export enum OrderDetailStates {
    Waiting = 'Waiting',
    Making = 'Making',
    Comfirming = 'Comfirming',
    DeliveryWaiting = 'DeliveryWaiting',
    Delivering = 'Delivering',
    Deliveried = 'Deliveried',
    Completed = 'Completed',
    Canceled = 'Canceled'
}

export enum AlertType {
    Info = 0,
    Error,
    Success,
    Warning
}