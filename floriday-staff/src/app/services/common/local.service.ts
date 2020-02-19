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
    static getAccessToken() {
        return LocalService.getItem(LOCAL_STORAGE_VARIABLE.access_token);
    }
    static setAccessToken(accessToken) {
        LocalService.setItem(LOCAL_STORAGE_VARIABLE.access_token, accessToken);
    }
    // static setUserAvt(avt: string) {
    //     LocalService.setItem(LOCAL_STORAGE_VARIABLE.user_avt, avt);
    // }
    // static getUserAvt(): string {
    //     return LocalService.getItem(LOCAL_STORAGE_VARIABLE.user_avt);
    // }
    static getLogStatus() {
        return JSON.parse(LocalService.getItem(LOCAL_STORAGE_VARIABLE.is_logged_in));
    }
    static setLogStatus(bool) {
        LocalService.setItem(LOCAL_STORAGE_VARIABLE.is_logged_in, bool);
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
}





