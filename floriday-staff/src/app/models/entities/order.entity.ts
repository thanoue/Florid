import { BaseEntity } from './base.entity';

export class Order extends BaseEntity {
    CustomerId: string;
    AccountId: string;
    VATIncluded: boolean;
    TotalAmount: number;
    TotalPaidAmount: number;

    GainedScore: number;
    ScoreUsed: number;
}

export class OrderDetail extends BaseEntity {
    OrderId: string;
    AdditionalFee: number;
    ProductId: string;
    ProductName: string;
    ProductPrice: number;
    ProductImageUrl: string;
    TotalAmount: number;
    ReceiverInfo: OrderReceiverDetail;
    Description: string;

    IsHardcodeProduct: boolean;
    HardcodeProductImageName: string;

    constructor() {
        super();
        this.ReceiverInfo = new OrderReceiverDetail();
    }
}

export class OrderReceiverDetail {

    ReceivingTime: number;
    ReceiverDetail: CustomerReceiverDetail;

    constructor() {
        this.ReceiverDetail = new CustomerReceiverDetail();
    }
}

export class CustomerReceiverDetail {
    FullName: string;
    PhoneNumber: string;
    Address: string;
}
