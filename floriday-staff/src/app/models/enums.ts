export enum EntityType {
    User,
    Product,
    Customer,
    Order,
}


export enum Roles {
    None = -1,
    Admin,
    Shipper,
    CustomerService,
    Florist,
    Others
}

export enum ProductCategories {
    Valentine,
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
    Waiting,
    Making,
    Comfirming,
    DeliveryWaiting,
    Delivering,
    Deliveried,
    Completed,
    Canceled
}
