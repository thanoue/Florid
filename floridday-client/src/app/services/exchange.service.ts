import { MembershipTypes } from '../models/enums';
import { Injectable } from '@angular/core';
import { OrderDetailDeliveryInfo } from '../models/view.models/order.model';
import { OrderReceiverDetail, CustomerReceiverDetail } from '../models/entities/order.entity';
import { getTranslationDeclStmts } from '@angular/compiler/src/render3/view/template';
import { float } from 'html2canvas/dist/types/css/property-descriptors/float';

@Injectable({
    providedIn: 'root'
})
export class ExchangeService {

    static getMemberDiscountPercent(membershipTypes: MembershipTypes): number {
        switch (membershipTypes) {
            case MembershipTypes.NewCustomer:
                return 0;
            case MembershipTypes.Member:
                return 5;
            case MembershipTypes.Vip:
                return 10;
            case MembershipTypes.VVip:
                return 15;
        }
    }

    static getFinalPrice(requestPrice: number, discountPercent: number, additionalFee: number) {
        return requestPrice - (requestPrice / 100) * discountPercent + additionalFee;
    }

    static getGainedScore(totalAmount: number): number {
        return totalAmount / 100000;
    }

    static geExchangableAmount(gainedScore: number) {
        return gainedScore * 1000;
    }

    static setTotalScore(currentScode: number, orderGainedScore: number, orderUsedScore: number): number {
        return currentScode - orderUsedScore + orderGainedScore;
    }

    static receiverInfoCompare(item1: CustomerReceiverDetail, item2: CustomerReceiverDetail): boolean {
        if (item1.Address !== item2.Address
            || item1.FullName !== item2.FullName
            || item1.PhoneNumber !== item2.PhoneNumber) {
            return false;
        } else {
            return true;
        }
    }

    static deliveryInfoCompare(item1: OrderDetailDeliveryInfo, item2: OrderDetailDeliveryInfo): boolean {
        if (!this.dateCompare(item1.DateTime, item2.DateTime)
            || item1.Address !== item2.Address
            || item1.FullName !== item2.FullName
            || item1.PhoneNumber !== item2.PhoneNumber) {
            return false;
        } else {
            return true;
        }
    }

    static dateCompare(first: Date, second: Date): boolean {
        if (first.getFullYear() !== second.getFullYear()
            || first.getMonth() !== second.getMonth()
            || first.getDate() !== second.getDate()
            || first.getHours() !== second.getHours()
            || first.getMinutes() !== second.getMinutes()) {
            return false;
        } else {
            return true;
        }
    }

    static stringPriceToNumber(res: string): number {
        // tslint:disable-next-line: no-debugger
        const length = res.length;
        const num = res.substring(0, length - 1);
        const finalString = num.replace(/,/g, '');
        const final = parseFloat(finalString);

        return final;
    }

    static getAlias(source: string): string {
        var str = source.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
        str = str.replace(/ + /g, " ");
        str = str.trim().replace(/ /g, '-');

        return str;
    }
}
