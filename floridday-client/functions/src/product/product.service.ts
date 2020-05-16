import * as adminSdk from '../helper/admin.sdk';

export async function updateIndex(startIndex: number, delta: number): Promise<any> {

    console.log('start index:', startIndex);

    return adminSdk.defauDatabase.ref("products").orderByChild('Index')
        .startAt(startIndex).once('value')
        .then((snapshot: any) => {

            try {
                const products: any[] = [];

                if (snapshot) {
                    snapshot.forEach((snap: any) => {
                        const product = snap.val();
                        products.push(product);
                    });
                }

                if (products.length <= 0) {
                    return;
                }

                console.log('index updating count:', products.length);


                interface IDictionary {
                    [index: string]: number;
                }

                var updates = {} as IDictionary;

                products.forEach((product: any) => {
                    updates[`/${product.Id}/Index`] = product.Index + delta;
                });

                return adminSdk.defauDatabase.ref('/products').update(updates);
            }
            catch (error) {
                throw error;
            }

        });
}

export async function updateCategoryIndex(category: number, startIndex: number, delta: number): Promise<number> {

    console.log(category, startIndex, delta);

    return adminSdk.defauDatabase.ref("products").orderByChild('CategoryIndex')
        .startAt(startIndex)
        .endAt(9999 + category * 10000).once('value')
        .then(async (snapshot: any) => {

            try {

                const products: any[] = [];

                if (snapshot) {

                    snapshot.forEach((snap: any) => {
                        let product = snap.val();
                        products.push(product);
                    });
                }

                console.log('category index updateing count:', products.length);

                if (products.length <= 0) {

                    return adminSdk.defauDatabase.ref('products').orderByChild('CategoryIndex')
                        .startAt(1 + (category + 1) * 10000)
                        .endAt(2 + (category + 1) * 10000)
                        .limitToFirst(1)
                        .once('value')
                        .then((snapshot: any) => {

                            let newProds: any;

                            snapshot.forEach((snap: any) => {
                                let product = snap.val();
                                newProds = product;
                            });

                            if (!newProds || newProds == undefined || newProds == null)
                                return 0;

                            return newProds.Index;

                        });
                }

                interface IDictionary {
                    [index: string]: number;
                }

                var updates = {} as IDictionary;

                products.forEach((product: any) => {
                    updates[`/${product.Id}/CategoryIndex`] = product.CategoryIndex + delta;
                });

                await adminSdk.defauDatabase.ref('/products').update(updates);

                return products[0].Index;
            }
            catch (error) {
                throw error;
            }

        });
}