import { MembershipTypes } from '../models/enums';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ExchangeService {

    static getMemberDiscountPercent(membershipTypes: MembershipTypes): number {
        switch (membershipTypes) {
            case MembershipTypes.NewCustomer:
                return 0;
            case MembershipTypes.StandardMember:
                return 5;
            case MembershipTypes.VipMember:
                return 10;
            case MembershipTypes.VVipMember:
                return 15;
        }
    }

    static getFinalPrice(requesrPrice: number, discountPercent: number, additionalFee: number) {
        return requesrPrice - (requesrPrice / 100) * discountPercent + additionalFee;
    }

    static getGainedScore(totalAmount: number): number {
        return totalAmount / 100000;
    }

    static geExchangableAmunt(gainedScore: number) {
        return gainedScore * 1000;
    }
}