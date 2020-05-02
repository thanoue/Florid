import * as adminSdk from '../helper/admin.sdk';

export async function searchCustomer(term: string): Promise<any> {
    console.log(term);
    return adminSdk.defauDatabase.ref('customers')
        .orderByChild('FullName')
        .startAt(term)
        .endAt(term + '\uf8ff')
        .once('value')
        .then((res: any) => {

            const customers: any[] = [];

            res.forEach((snapShot: any) => {
                customers.push(snapShot.val());
            });

            if (customers.length > 0) {
                console.log('search by name');
                return customers;
            } else {
                return adminSdk.defauDatabase.ref('customers')
                    .orderByChild('PhoneNumber')
                    .startAt(term)
                    .endAt(term + '\uf8ff')
                    .once('value')
                    .then((phoneRes: any) => {

                        const _customers: any[] = [];

                        phoneRes.forEach((snapShot: any) => {
                            _customers.push(snapShot.val());
                        });
                        console.log('search by phone num');

                        return _customers
                    })
            }
        });
}
