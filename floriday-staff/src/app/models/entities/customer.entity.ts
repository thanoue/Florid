import { BaseEntity } from './base.entity';
import { MembershipTypes } from '../enums';

export class Customer extends BaseEntity {
    FullName: string;
    PhoneNumber: string;
    Birthday: Date;
    SpecialDays: Date[];
    SocialMedia: CustomerSocialMediaInfo;
    ContactInfo: CustomerContactInfo;
    Address: CustomerAddress;
    MembershipType: MembershipTypes;
    MembershipInfo: MembershipInfo;

    constructor() {
        super();
        this.SocialMedia = new CustomerSocialMediaInfo();
        this.ContactInfo = new CustomerContactInfo();
        this.Address = new CustomerAddress();
        this.MembershipInfo = new MembershipInfo();
    }
}

export class MembershipInfo {
    UsedScore: number;
    CurrentlyScore: number;
    AccumulatedAmount: number;
}

export class CustomerSocialMediaInfo {
    Facebook: string;
    Instagram: string;
    Skype: string;
}

export class CustomerContactInfo {
    Zalo: string;
    Viber: string;
}

export class CustomerAddress {
    Home: string;
    Work: string;
}

