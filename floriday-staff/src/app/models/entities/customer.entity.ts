import { BaseEntity } from './base.entity';
import { MembershipTypes } from '../enums';

export class Customer extends BaseEntity {
    FullName: string;
    PhoneNumber: string;
    Birthday: Date;
    SpecialDays: Date[];
    ContactInfo: CustomerContactInfo;
    Address: CustomerAddress;
    MembershipInfo: MembershipInfo;

    constructor() {
        super();
        this.ContactInfo = new CustomerContactInfo();
        this.Address = new CustomerAddress();
        this.MembershipInfo = new MembershipInfo();
        this.FullName = '';
        this.PhoneNumber = '';
        this.Birthday = new Date();
        this.SpecialDays = [];
    }
}

export class MembershipInfo {
    UsedScoreTotal = 0;
    AvailableScore = 0;
    AccumulatedAmount = 0;
    MembershipType: MembershipTypes = MembershipTypes.NewCustomer;
}


export class CustomerContactInfo {
    Zalo = '';
    Viber = '';
    Facebook = '';
    Instagram = '';
    Skype = '';
}

export class CustomerAddress {
    Home = '';
    Work = '';
}

