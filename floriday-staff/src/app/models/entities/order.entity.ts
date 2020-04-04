import { BaseEntity } from './base.entity';
import { OrderDetailStates } from '../enums';

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
    ProductImageUrl = '';
    ProductModifiedPrice = 0;
    ProductPrice = 0;
    TotalAmount = 0;
    DeliveryInfo: OrderReceiverDetail;
    Description = '';
    Index = -1;
    State = OrderDetailStates.Waiting;

    IsHardcodeProduct = false;
    HardcodeProductImageName = '';

    constructor() {
        super();
        this.DeliveryInfo = new OrderReceiverDetail();
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
