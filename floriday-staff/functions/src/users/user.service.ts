
const jwt = require('jsonwebtoken');
import * as adminSdk from '../helper/admin.sdk';
const sha256 = require('js-sha256');

export async function authenticate(body: any): Promise<any> {

    return adminSdk.defauDatabase.ref('/users').orderByChild('Email').equalTo(body.username).once('value')
        .then((snapshot: any) => {

            let key = '';
            let user: any;

            snapshot.forEach((data: any) => {
                key = data.key;
                user = data.val()
            });


            if (user) {

                const hashedPassword = sha256.hmac.create(adminSdk.momoConfig.secretKey).update(body.password).hex();

                if (hashedPassword !== user.Password) {
                    return false;
                }

                const token = jwt.sign({ sub: key, role: user.Role }, adminSdk.OAuthPrivateKey);
                const { Password, ...userWithoutPassword } = user;

                return {
                    ...userWithoutPassword,
                    token
                };
            } else {
                return false;
            }
        })
        .catch((error: any) => { throw error; })
}

export async function createUser(req: any): Promise<any> {

    req.body.emailVerified = true;

    return adminSdk.defaultAuth.createUser(req.body)
        .then((userRecord: any) => {

            const hashedPassword = sha256.hmac.create(adminSdk.momoConfig.secretKey).update(req.body.password).hex();

            adminSdk.defauDatabase.ref('users').child(userRecord.uid).set({
                PhoneNumber: userRecord.phoneNumber,
                FullName: userRecord.displayName,
                Email: userRecord.email,
                AvtUrl: userRecord.photoURL,
                Active: true,
                Role: req.body.role,
                Password: hashedPassword
            });

            return userRecord;
        })
        .catch(function (error: any) {
            throw error;
            //res.status(403).send(error);
        });
}

