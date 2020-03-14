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

    static getFinalPrice(requestPrice: number, discountPercent: number, additionalFee: number) {
        return requestPrice - (requestPrice / 100) * discountPercent + additionalFee;
    }

    static getGainedScore(totalAmount: number): number {
        return totalAmount / 100000;
    }

    static geExchangableAmunt(gainedScore: number) {
        return gainedScore * 1000;
    }

    static stringPriceToNumber(res: string): number {
        // tslint:disable-next-line: no-debugger
        const length = res.length;
        const num = res.substring(0, length - 1);
        const finalString = num.replace(/,/g, '');
        const final = parseFloat(finalString);

        return final;
    }
}
