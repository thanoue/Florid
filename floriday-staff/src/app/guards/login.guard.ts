import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/common/auth.service';
@Injectable({
    providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
    constructor(private router: Router) {
    }
    canActivate() {
        if (AuthService.isLoggedIn()) {
            return true;
        } else {
            this.router.navigate(['login']);
            return false;
        }
    }
}
