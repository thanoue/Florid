import { LOCAL_STORAGE_VARIABLE } from '../../app.constants';
import { Roles } from 'src/app/models/enums';

export class LocalService {

    static getItem(key: string) {
        return localStorage.getItem(key);
    }

    static setItem(key: string, value: any) {
        return localStorage.setItem(key, value);
    }

    static removeItem(key: string) {
        return localStorage.removeItem(key);
    }

    static clear() {
        localStorage.clear();
    }

    static logout() {
        LocalService.clear();
    }

    static getUserId() {
        return LocalService.getItem(LOCAL_STORAGE_VARIABLE.user_id);
    }
    static setUserId(id) {
        LocalService.setItem(LOCAL_STORAGE_VARIABLE.user_id, id);
    }

    static getRole() {
        // tslint:disable-next-line:radix
        return parseInt(LocalService.getItem(LOCAL_STORAGE_VARIABLE.role));
    }
    static setRole(role: Roles) {
        LocalService.setItem(LOCAL_STORAGE_VARIABLE.role, role);
    }

    static setUserName(name: string) {
        LocalService.setItem(LOCAL_STORAGE_VARIABLE.user_name, name);
    }
    static getUserName() {
        return LocalService.getItem(LOCAL_STORAGE_VARIABLE.user_name);
    }

    static getAccessToken() {
        return LocalService.getItem(LOCAL_STORAGE_VARIABLE.access_token);
    }

    static setAccessToken(token: string) {
        LocalService.setItem(LOCAL_STORAGE_VARIABLE.access_token, token);
    }

    static getUserAvtUrl() {
        return LocalService.getItem(LOCAL_STORAGE_VARIABLE.user_avt_url);
    }

    static setUserAvtUrl(url: string) {
        LocalService.setItem(LOCAL_STORAGE_VARIABLE.user_avt_url, url);
    }

    static getUserEmail() {
        return LocalService.getItem(LOCAL_STORAGE_VARIABLE.user_avt_url);
    }

    static setUserEmail(email: string) {
        LocalService.setItem(LOCAL_STORAGE_VARIABLE.user_avt_url, email);
    }

    static getPhoneNumber() {
        return LocalService.getItem(LOCAL_STORAGE_VARIABLE.phone_number);
    }

    static setPhoneNumber(phoneNumber: string) {
        LocalService.setItem(LOCAL_STORAGE_VARIABLE.phone_number, phoneNumber);
    }

}





