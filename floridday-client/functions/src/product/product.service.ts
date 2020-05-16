import * as adminSdk from '../helper/admin.sdk';

export async function updateIndex(startIndex: number, delta: number): Promise<any> {

    return adminSdk.defauDatabase.ref("products").orderByChild('Index')
        .startAt(startIndex).once('value')
        .then((snapshot: any) => {

            try {
                const products: any[] = [];

                snapshot.forEach((snap: any) => {
                    const product = snap.val();
                    products.push(product);
                });

                if (products.length <= 0) {
                    return;
                }

                interface IDictionary {
                    [index: string]: number;
                }

                var updates = {} as IDictionary;

                products.forEach((product: any) => {
                    updates[`/${product.Id}/Index`] = product.Index + delta;
                });

                return adminSdk.defauDatabase.ref('products').update(updates);
            }
            catch (error) {
                throw error;
            }

        });
}

export async function updateCategoryIndex(category: number, startIndex: number, delta: number): Promise<number> {

    return adminSdk.defauDatabase.ref("products").orderByChild('CategoryIndex')
        .startAt(startIndex)
        .endAt(9999 + category * 10000).once('value')
        .then(async (snapshot: any) => {

            try {

                const products: any[] = [];

                snapshot.forEach((snap: any) => {
                    const product = snap.val();
                    products.push(product);
                });

                if (products.length <= 0) {
                    return 0;
                }

                interface IDictionary {
                    [index: string]: number;
                }

                var updates = {} as IDictionary;

                products.forEach((product: any) => {
                    updates[`/${product.Id}/CategoryIndex`] = product.CategoryIndex + delta;
                });

                await adminSdk.defauDatabase.ref('products').update(updates);

                return products[0].Index;
            }
            catch (error) {
                throw error;
            }

        });
}