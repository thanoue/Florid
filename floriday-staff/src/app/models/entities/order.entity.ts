import { BaseEntity } from './base.entity';

export class Order extends BaseEntity {
    CustomerId = '';
    AccountId = '';
    VATIncluded = false;
    TotalAmount = 0;
    TotalPaidAmount = 0;

    GainedScore = 0;
    ScoreUsed = 0;
}

export class OrderDetail extends BaseEntity {
    OrderId = '';
    AdditionalFee = 0;
    ProductId = '';
    ProductName = '';
    ProductPrice = 0;
    ProductImageUrl = '';
    TotalAmount = 0;
    ReceiverInfo: OrderReceiverDetail;
    Description = '';

    IsHardcodeProduct = false;
    HardcodeProductImageName = '';

    constructor() {
        super();
        this.ReceiverInfo = new OrderReceiverDetail();
    }
}

export class OrderReceiverDetail {

    ReceivingTime = 0;
    ReceiverDetail: CustomerReceiverDetail;

    constructor() {
        this.ReceiverDetail = new CustomerReceiverDetail();
    }
}

export class CustomerReceiverDetail {
    FullName = '';
    PhoneNumber = '';
    Address = '';
}
