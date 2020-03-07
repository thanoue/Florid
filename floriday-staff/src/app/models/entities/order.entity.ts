import { BaseEntity } from './base.entity';

export class Order extends BaseEntity {
    CustomerId: string;
    CustomerServiceId: string;
    VATIncluded: string;
    TotalAmount: string;
    TotalPaidAmount: string;
}

export class OrderDetail extends BaseEntity {
    OrderId: string;
    Quantity: string;
    AdditionalFee: string;
    ProductId: string;
    ProductName: string;
    ProductPrice: string;
    ProductImage: string;
    TotalAmount: string;
    ReceiverDetail: OrderReceiverDetail;

    constructor() {
        super();
        this.ReceiverDetail = new OrderReceiverDetail();
    }
}

export class OrderReceiverDetail {

    ReceivingTime: Date;
    ReceiverDetail: CustomerReceiverDetail;

    constructor() {
        this.ReceiverDetail = new CustomerReceiverDetail();
    }
}

export class CustomerReceiverDetail extends BaseEntity {
    FullName: string;
    PhoneNumber: string;
    Address: string;
    CustomerId: string;
}
