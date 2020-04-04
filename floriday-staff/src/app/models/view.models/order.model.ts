import { OrderDetailStates } from '../../models/enums';
import { MembershipTypes } from '../enums';
import { Customer } from '../entities/customer.entity';
import { ExchangeService } from '../../services/exchange.service';
import { CustomerReceiverDetail, OrderDetail, Order } from '../entities/order.entity';

export class OrderViewModel {
    OrderId: string;
    TotalAmount: number;
    TotalPaidAmount: number;
    CreatedDate: Date;
    VATIncluded = false;
    CustomerInfo: OrderCustomerInfoViewModel;

    OrderDetails: OrderDetailViewModel[];


    static ToViewModel(entity: Order, customer: Customer): OrderViewModel {

        const vm = new OrderViewModel();
        vm.OrderId = entity.Id;
        vm.TotalAmount = entity.TotalAmount;
        vm.TotalPaidAmount = entity.TotalPaidAmount;
        vm.VATIncluded = entity.VATIncluded;
        vm.CreatedDate = new Date(entity.Created);

        vm.CustomerInfo.ScoreUsed = entity.ScoreUsed;
        vm.CustomerInfo.GainedScore = entity.GainedScore;
        vm.CustomerInfo.Id = entity.CustomerId;
        vm.CustomerInfo.MembershipType = customer.MembershipInfo.MembershipType;
        vm.CustomerInfo.DiscountPercent = ExchangeService.getMemberDiscountPercent(vm.CustomerInfo.MembershipType);
        vm.CustomerInfo.Name = customer.FullName;
        vm.CustomerInfo.PhoneNumber = customer.PhoneNumber;
        Object.assign(vm.CustomerInfo.ReceiverInfos, customer.ReceiverInfos);// customer.ReceiverInfos;

        return vm;
    }

    constructor() {
        this.OrderDetails = [];
        this.CustomerInfo = new OrderCustomerInfoViewModel();
        this.TotalAmount = 0;
        this.TotalPaidAmount = 0;
        this.CreatedDate = new Date();
        this.OrderId = '';
    }
}

export class OrderDetailViewModel {

    ProductName = '';
    OrderDetailId = '';
    OrderId = '';
    State = OrderDetailStates.Waiting;
    ProductId = '';
    ProductImageUrl = '';
    Quantity = 1;
    Index = 0;
    DeliveryInfo: OrderDetailDeliveryInfo;

    OriginalPrice = 0;
    ModifiedPrice = 0;
    AdditionalFee = 0;

    Description = '';

    IsFromHardCodeProduct = false;
    HardcodeImageName = '';

    constructor() {
        this.DeliveryInfo = new OrderDetailDeliveryInfo();
    }

    static ToViewModel(entity: OrderDetail) {
        const vm = new OrderDetailViewModel();

        vm.OrderDetailId = entity.Id;
        vm.OrderId = entity.OrderId;
        vm.AdditionalFee = entity.AdditionalFee;
        vm.Description = entity.Description;
        vm.Index = entity.Index;

        vm.ModifiedPrice = entity.ProductModifiedPrice;
        vm.ProductId = entity.Id;
        vm.OriginalPrice = entity.ProductPrice;
        vm.ProductImageUrl = entity.ProductImageUrl;
        vm.ProductName = entity.ProductName;

        vm.IsFromHardCodeProduct = entity.IsHardcodeProduct;
        vm.HardcodeImageName = entity.HardcodeProductImageName;

        vm.DeliveryInfo.DateTime = new Date(entity.DeliveryInfo.ReceivingTime);
        vm.DeliveryInfo.Address = entity.DeliveryInfo.ReceiverDetail.Address;
        vm.DeliveryInfo.FullName = entity.DeliveryInfo.ReceiverDetail.FullName;
        vm.DeliveryInfo.PhoneNumber = entity.DeliveryInfo.ReceiverDetail.PhoneNumber;

        vm.State = entity.State;
        vm.Quantity = 1;

        return vm;
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
        viewModel.IsFromHardCodeProduct = model.IsFromHardCodeProduct;

        return viewModel;
    }
}

export class OrderDetailDeliveryInfo {

    DateTime = new Date();
    Address: string;
    FullName: string;
    PhoneNumber: string;

    static DeepCopy(source: OrderDetailDeliveryInfo): OrderDetailDeliveryInfo {

        const dest = new OrderDetailDeliveryInfo();

        dest.Address = source.Address;
        dest.FullName = source.FullName;
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
    ScoreUsed = 0; // điểm KH muốn sử dụng cho hoá đơn này
    GainedScore = 0; // điểm kiếm được từ hoá đơn
    ReceiverInfos: CustomerReceiverDetail[];
    AvailableScore = 0;
    PhoneNumber: string;
    MembershipType: MembershipTypes;

    constructor() {
        this.ReceiverInfos = [];
    }

    static toViewModel(customer: Customer): OrderCustomerInfoViewModel {
        const viewModel = new OrderCustomerInfoViewModel();

        viewModel.Id = customer.Id;
        viewModel.Name = customer.FullName;
        viewModel.PhoneNumber = customer.PhoneNumber;
        viewModel.MembershipType = customer.MembershipInfo.MembershipType;
        viewModel.DiscountPercent = ExchangeService.getMemberDiscountPercent(customer.MembershipInfo.MembershipType);
        viewModel.AvailableScore = customer.MembershipInfo.AvailableScore;
        Object.assign(viewModel.ReceiverInfos, customer.ReceiverInfos);

        return viewModel;
    }
}