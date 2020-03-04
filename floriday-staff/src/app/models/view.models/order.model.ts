import { OrderDetailStates } from '../../models/enums';
export class OrderViewModel {
    OrderId: string;
    CustomerName: string;
    CustomerId: string;
    TotalAmount: number;
    CreatedDate: Date;
    Index: number;
    OrderDetails: OrderDetailViewModel[];
    constructor() {
        this.OrderDetails = [];
    }
}

export class OrderDetailViewModel {
    ProductName: string;
    OrderDetailId: string;
    State: OrderDetailStates;
    ProductUrl: string;
    Quantity: number;
    DeliveryDate: Date;
    DeliveryTime: string;
    DeliveryAddress: string;
    Index: number;
}