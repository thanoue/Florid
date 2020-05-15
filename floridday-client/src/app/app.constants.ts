
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
