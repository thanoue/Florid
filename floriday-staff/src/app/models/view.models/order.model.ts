import { OrderDetailStates } from '../../models/enums';
import { MembershipTypes } from '../enums';
import { Customer } from '../entities/customer.entity';
import { ExchangeService } from '../../services/exchange.service';

export class OrderViewModel {
    OrderId: string;
    TotalAmount: number;
    TotalPaidAmount: number;
    CreatedDate: Date;
    Index: number;
    CustomerInfo: OrderCustomerInfoViewModel;

    OrderDetails: OrderDetailViewModel[];

    constructor() {
        this.OrderDetails = [];
        this.CustomerInfo = new OrderCustomerInfoViewModel();
        this.TotalAmount = 0;
        this.TotalPaidAmount = 0;
        this.Index = 0;
        this.CreatedDate = new Date();
        this.OrderId = '';
    }
}

export class OrderDetailViewModel {

    ProductName: string;
    OrderDetailId: string;
    State: OrderDetailStates;
    ProductUrl: string;
    Quantity = 0;
    Index = 0;
    DeliveryInfo: OrderDetailDeliveryInfo;

    OriginalPrice = 0;
    ModifiedPrice = 0;
    AdditionalFee = 0;

    Description: string;

    constructor() {
        this.DeliveryInfo = new OrderDetailDeliveryInfo();
    }
}

export class OrderDetailDeliveryInfo {

    DateTime = new Date();
    Address: string;
    Name: string;
    PhoneNumber: string;

    static DeepCopy(source: OrderDetailDeliveryInfo): OrderDetailDeliveryInfo {

        const dest = new OrderDetailDeliveryInfo();

        dest.Address = source.Address;
        dest.Name = source.Name;
        dest.PhoneNumber = source.PhoneNumber;

        dest.DateTime.setFullYear(source.DateTime.getFullYear());
        dest.DateTime.setMonth(source.DateTime.getMonth());
        dest.DateTime.setDate(source.DateTime.getDate());
        dest.DateTime.setHours(source.DateTime.getHours());
        dest.DateTime.setMinutes(source.DateTime.getMinutes());
        dest.DateTime.setSeconds(0);

        return dest;
    }
}

export class OrderCustomerInfoViewModel {

    Name: string;
    Id: string;
    DiscountPercent = 0;
    AvailableScore = 0;
    ScoreUsed = 0;
    UsedScoreTotal = 0;
    PhoneNumber: string;


    static toViewModel(customer: Customer): OrderCustomerInfoViewModel {
        const viewModel = new OrderCustomerInfoViewModel();

        viewModel.Id = customer.Id;
        viewModel.Name = customer.FullName;
        viewModel.PhoneNumber = customer.PhoneNumber;
        viewModel.DiscountPercent = ExchangeService.getMemberDiscountPercent(customer.MembershipInfo.MembershipType);
        viewModel.AvailableScore = customer.MembershipInfo.AvailableScore;
        viewModel.UsedScoreTotal = customer.MembershipInfo.UsedScoreTotal;

        return viewModel;
    }


}