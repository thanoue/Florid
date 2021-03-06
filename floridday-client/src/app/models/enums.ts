import { emit } from 'process';

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

export enum MembershipTypes {
    NewCustomer = 'NewCustomer',
    Member = 'Member',
    Vip = 'Vip',
    VVip = 'VVip'
}

export enum CusContactInfoTypes {
    Zalo = 'Zalo',
    Viber = 'Viber',
    Facebook = 'Facebook',
    Skype = 'Skype',
    Instagram = 'Instagram'
}

export enum OrderDetailStates {
    Added = 'Added',
    Waiting = 'Waiting',
    Making = 'Making',
    Comfirming = 'Comfirming',
    DeliveryWaiting = 'DeliveryWaiting',
    Delivering = 'Delivering',
    Deliveried = 'Deliveried',
    Completed = 'Completed',
    Canceled = 'Canceled'
}

export enum Sexes {
    Male = 'Male',
    Female = 'Female',
    Others = 'Others'
}

export enum AlertType {
    Info = 0,
    Error,
    Success,
    Warning
}
