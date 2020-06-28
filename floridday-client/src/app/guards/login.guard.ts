import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import * as firebase from 'firebase';
import { AuthService } from '../services/common/auth.service';
import { Roles } from '../models/enums';
import { GlobalService } from '../services/common/global.service';
@Injectable({
    providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

    constructor(private router: Router, private globalServie: GlobalService) {
    }
    canActivate() {

        if (this.globalServie.firebaseConfig) {
            const user = firebase.auth().currentUser;
            if (user) {
                return true;
            } else {
                this.router.navigate(['login']);
                return false;
            }
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

    constructor(private router: Router, private globalServie: GlobalService) {
    }

    canActivate() {

        let loggedInGuard = new LoggedInGuard(this.router, this.globalServie);

        if (!loggedInGuard.canActivate())
            return false;

        const role = (AuthService.getCurrentRole());
        if (role == Roles.Admin || role == Roles.Account) {
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
export class AccountAndShipperGuard implements CanActivate {

    constructor(private router: Router, private globalServie: GlobalService) {
    }

    canActivate() {

        let loggedInGuard = new LoggedInGuard(this.router, this.globalServie);

        if (!loggedInGuard.canActivate())
            return false;

        const role = (AuthService.getCurrentRole());
        if (role == Roles.Admin || role == Roles.Account || role == Roles.Shipper) {
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
export class FloristGuard implements CanActivate {

    constructor(private router: Router, private globalServie: GlobalService) {
    }

    canActivate() {

        let loggedInGuard = new LoggedInGuard(this.router, this.globalServie);

        if (!loggedInGuard.canActivate())
            return false;

        const role = (AuthService.getCurrentRole());
        if (role == Roles.Florist) {
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
export class ShipperGuard implements CanActivate {

    constructor(private router: Router, private globalServie: GlobalService) {
    }

    canActivate() {

        let loggedInGuard = new LoggedInGuard(this.router, this.globalServie);

        if (!loggedInGuard.canActivate())
            return false;

        const role = (AuthService.getCurrentRole());
        if (role == Roles.Shipper) {
            return true;
        } else {
            this.router.navigate(['login']);
            return false;
        }
    }
}