import { BaseEntity } from './base.entity';
import { OrderDetailStates, Roles } from '../enums';

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
    State = OrderDetailStates.Added;
    MakingSortOrder = 0;
    ShippingSortOrder = 0;

    IsHardcodeProduct = false;
    HardcodeProductImageName = '';

    FloristInfo: ODFloristInfo;
    ShipperInfo: ODShipperInfo;

    SeenUsers: ODSeenUserInfo[];

    constructor() {
        super();

        this.DeliveryInfo = new OrderReceiverDetail();
        this.FloristInfo = new ODFloristInfo();
        this.ShipperInfo = new ODShipperInfo();
        this.SeenUsers = [];
    }
}

export class ODSeenUserInfo {
    FullName: string;
    UserId: string;
    Role: Roles;
    Avt: string;

    static DeepCopy(model: ODSeenUserInfo): ODSeenUserInfo {

        var vm = new ODSeenUserInfo();

        vm.Avt = model.Avt;
        vm.FullName = model.FullName;
        vm.Role = model.Role;
        vm.UserId = model.UserId;

        return vm;
    }
}

export class ODFloristInfo {
    Id: string;
    FullName: string;
    AssignTime: number;
    CompletedTime: number;
}

export class ODShipperInfo {
    Id: string;
    FullName: string;
    AssignTime: number;
    CompletedTime: number;
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
