
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
                    token,
                    key
                };
            } else {
                return false;
            }
        })
        .catch((error: any) => { throw error; })
}



export async function forceUserLogout(userId: string, token: string): Promise<boolean> {

    const message = {
        data: {
            userId: userId,
            content: 'ForceLogout'
        },
        token: token
    };

    return adminSdk.messaging.send(message)
        .then((response: any) => {
            // Response is a message ID string.
            console.info('Successfully sent message:', response);
            return true;
        })
        .catch((error: any) => {
            console.info('Error sending message:', error);
            return false;
        });
}

export function getUser(uid: string): Promise<any> {

    return adminSdk.defaultAuth.getUser(uid)
        .then((userRecord: any) => {

            const customClaims = (userRecord.customClaims || { role: '', isPrinter: false }) as { role?: string, isPrinter?: boolean };

            const role = customClaims.role ? customClaims.role : '';
            const isPrinter = customClaims.isPrinter ? customClaims.isPrinter : false;

            return {
                ...userRecord,
                role,
                isPrinter
            };
        });
}

export function getAllUsers(): Promise<any> {

    return adminSdk.defaultAuth.listUsers()
        .then((usersRes: any) => {

            console.log('user list:', usersRes);
            const users: any[] = [];

            usersRes.users.forEach((userRecord: any) => {
                const customClaims = (userRecord.customClaims || { role: '', isPrinter: false }) as { role?: string, isPrinter?: boolean };

                const role = customClaims.role ? customClaims.role : '';
                const isPrinter = customClaims.isPrinter ? customClaims.isPrinter : false;

                users.push({
                    ...userRecord,
                    role,
                    isPrinter
                });
            });

            return users;
        });
}

export async function createUser(body: any): Promise<any> {

    body.emailVerified = true;

    return adminSdk.defaultAuth.createUser(body)
        .then(async (userRecord: any) => {

            await adminSdk.defaultAuth.setCustomUserClaims(userRecord.uid, { role: body.Role, isPrinter: body.IsPrinter })

            const hashedPassword = sha256.hmac.create(adminSdk.momoConfig.secretKey).update(body.password).hex();

            adminSdk.defauDatabase.ref('users').child(userRecord.uid).set({
                PhoneNumber: userRecord.phoneNumber,
                FullName: userRecord.displayName,
                Email: userRecord.email,
                AvtUrl: userRecord.photoURL,
                Active: true,
                Role: body.Role,
                IsPrinter: body.IsPrinter,
                Password: hashedPassword,
            });

            return userRecord;
        })
        .catch(function (error: any) {
            throw error;
            //res.status(403).send(error);
        });
}

