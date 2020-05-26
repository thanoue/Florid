import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import * as firebase from 'firebase';
import { AuthService } from '../services/common/auth.service';
import { Roles } from '../models/enums';
@Injectable({
    providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
    constructor(private router: Router) {
    }
    canActivate() {
        const user = firebase.auth().currentUser;
        if (user) {
            return true;
        } else {
            this.router.navigate(['login']);
            return false;
        }
    }
}

@Injectable({
    providedIn: 'root'
})
export class AccountGuard implements CanActivate {

    constructor(private router: Router) {
    }

    canActivate() {
        let loggedInGuard = new LoggedInGuard(this.router);

        const role = (AuthService.getCurrentRole());
        return loggedInGuard.canActivate() && (role == Roles.Admin || role == Roles.Account);
    }
}

@Injectable({
    providedIn: 'root'
})
export class FloristGuard implements CanActivate {

    constructor(private router: Router) {
    }

    canActivate() {
        const role = (AuthService.getCurrentRole());
        return role == Roles.Florist;
    }
}


@Injectable({
    providedIn: 'root'
})
export class ShipperGuard implements CanActivate {

    constructor(private router: Router) {
    }

    canActivate() {
        const role = (AuthService.getCurrentRole());
        return role == Roles.Shipper;
    }
}