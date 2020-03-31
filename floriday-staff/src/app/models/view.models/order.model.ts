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
    VATIncluded = false;
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
    ProductId: string;
    ProductImageUrl: string;
    Quantity = 1;
    Index = 0;
    DeliveryInfo: OrderDetailDeliveryInfo;

    OriginalPrice: number;
    ModifiedPrice: number;
    AdditionalFee: number;

    Description: string;

    IsFromLocalProduct: boolean;

    constructor() {
        this.DeliveryInfo = new OrderDetailDeliveryInfo();
    }

    static DeepCopy(model: OrderDetailViewModel) {

        const viewModel = new OrderDetailViewModel();

        viewModel.ProductName = model.ProductName;
        viewModel.OrderDetailId = model.OrderDetailId;
        viewModel.State = model.State;
        viewModel.ProductId = model.ProductId;
        viewModel.ProductImageUrl = model.ProductImageUrl;
        viewModel.Quantity = model.Quantity;
        viewModel.Index = model.Index;
        viewModel.DeliveryInfo = OrderDetailDeliveryInfo.DeepCopy(model.DeliveryInfo);
        viewModel.OriginalPrice = model.OriginalPrice;
        viewModel.ModifiedPrice = model.ModifiedPrice;
        viewModel.AdditionalFee = model.AdditionalFee;
        viewModel.Description = model.Description;
        viewModel.IsFromLocalProduct = model.IsFromLocalProduct;

        return viewModel;
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
    AvailableScore = 0; // điểm có sẵn của KH
    ScoreUsed = 0; // điểm KH muốn sử dụng cho hoá đơn này
    UsedScoreTotal = 0; // tổng điểm KH đã sử dụng 
    GainedScore = 0; // điểm kiếm được từ hoá đơn
    TotalScore = 0; // tổng điểm

    PhoneNumber: string;
    MembershipType: MembershipTypes;

    static toViewModel(customer: Customer): OrderCustomerInfoViewModel {
        const viewModel = new OrderCustomerInfoViewModel();

        viewModel.Id = customer.Id;
        viewModel.Name = customer.FullName;
        viewModel.PhoneNumber = customer.PhoneNumber;
        viewModel.MembershipType = customer.MembershipInfo.MembershipType;
        viewModel.DiscountPercent = ExchangeService.getMemberDiscountPercent(customer.MembershipInfo.MembershipType);
        viewModel.AvailableScore = customer.MembershipInfo.AvailableScore;
        viewModel.UsedScoreTotal = customer.MembershipInfo.UsedScoreTotal;

        return viewModel;
    }
}