import { ProductCategories } from './models/enums';

export const LOCAL_STORAGE_VARIABLE = {
    role: 'user_role',
    user_id: 'user_id',
    is_logged_in: 'is_logged_in',
    user_name: 'user_name',
    access_token: 'access_token',
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

export const REQUEST_TIMEOUT = 30000;

export const PRODUCTCATEGORIES = [
    {
        Name: 'Valentine',
        Value: ProductCategories.Valentine
    },
    {
        Name: 'Bó hoa tươi',
        Value: ProductCategories.BoHoaTuoi
    },
    {
        Name: 'Bình hoa tươi',
        Value: ProductCategories.BinhHoaTuoi
    },
    {
        Name: 'Hộp hoa tươi',
        Value: ProductCategories.HopHoaTuoi
    },
    {
        Name: 'Giỏ hoa tươi',
        Value: ProductCategories.GioHoaTuoi
    },
    {
        Name: 'Hoa cưới',
        Value: ProductCategories.HoaCuoi
    },
    {
        Name: 'Hoa nghệ thuật',
        Value: ProductCategories.HoaNgheThuat
    },
    {
        Name: 'Kệ hoa tươi',
        Value: ProductCategories.KeHoaTuoi
    },
    {
        Name: 'Hoa sự kiện',
        Value: ProductCategories.HoaSuKien
    },
    {
        Name: 'Lan hồ điệp',
        Value: ProductCategories.LanHoDiep
    },
];