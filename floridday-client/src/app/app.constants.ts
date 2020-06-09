import { OrderDetailStates, Roles } from './models/enums';

export const LOCAL_STORAGE_VARIABLE = {
    role: 'user_role',
    user_id: 'user_id',
    is_logged_in: 'is_logged_in',
    user_name: 'user_name',
    access_token: 'access_token',
    api_access_token: 'api_access_token',
    phone_number: 'phone_number',
    user_avt_url: 'user_avt_url',
    user_email: 'user_email',
    is_printer: 'is_printer'
};

export const API_END_POINT = {
    login: '/users/login',
    force_user_logout: '/users/forceUserLogout',
    momo_qr_confirm: '/sale/momo/qr/confirm',
    logout: '/users/logout'
};

export const ROLES = [
    {
        Role: Roles.Account,
        DisplayName: 'Chăm sóc khách hàng'
    },
    {
        Role: Roles.Admin,
        DisplayName: 'Quản trị viên'
    },
    {
        Role: Roles.Florist,
        DisplayName: 'Thợ cắm hoa'
    },
    {
        Role: Roles.Shipper,
        DisplayName: 'Người giao hàng'
    },
]

export const ORDER_DETAIL_STATES = [
    {
        State: OrderDetailStates.Added,
        DisplayName: 'Đã chốt đơn'
    },
    {
        State: OrderDetailStates.Waiting,
        DisplayName: 'Đang chờ cắm'
    },
    {
        State: OrderDetailStates.Making,
        DisplayName: 'Đang cắm'
    },
    {
        State: OrderDetailStates.Comfirming,
        DisplayName: 'Đang xác nhận thành phẩm'
    },
    {
        State: OrderDetailStates.DeliveryWaiting,
        DisplayName: 'Đã xác nhận SP, chưa có người giao'
    },
    {
        State: OrderDetailStates.Delivering,
        DisplayName: 'Đang giao'
    },
    {
        State: OrderDetailStates.Deliveried,
        DisplayName: 'Đã giao, đang xác nhận giao'
    },
    {
        State: OrderDetailStates.Completed,
        DisplayName: 'Đã hoàn tất'
    },
    {
        State: OrderDetailStates.Canceled,
        DisplayName: 'Đã huỷ'
    },
]

export const REQUEST_TIMEOUT = 30000;
