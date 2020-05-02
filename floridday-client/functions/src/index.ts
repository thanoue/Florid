
import * as functions from 'firebase-functions';
import * as bodyParser from 'body-parser';
const cors = require('cors');
import * as userService from '././users/user.service';
import * as  userRouter from './users/user.controller';
import * as saleRouter from './sale/sale.controller';
import * as adminSdk from './helper/admin.sdk';
import * as authrorize from './helper/ authorize';
import { Role } from './helper/role';
import * as customerService from '././customer/customer.service';

const express = require('express');
const jwt = require('express-jwt');
const blacklist = require('express-jwt-blacklist');
const app = new express();
const main = new express();

app.use(cors({ origin: true }));


app.use(jwt({ secret: adminSdk.OAuthPrivateKey, isRevoked: blacklist.isRevoked }).unless({
    path: [
        // public routes that don't require authentication
        '/api/v1/users/login',
        '/api/v1/sale/momo/qr/request'
    ]
}));

app.use('/users', userRouter);
app.use('/sale', saleRouter);

main.use('/api/v1', app);
// tslint:disable-next-line: deprecation
main.use(bodyParser.json());
// tslint:disable-next-line: deprecation
main.use(bodyParser.urlencoded({ extended: false }));

export const webApi = functions.https.onRequest(main);

async function excuteFunction(context: functions.https.CallableContext, token: string, calback: () => Promise<any>, roles: Role[] | string = []): Promise<any> {

    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Unauthenticated');
    }

    const isAuth = await authrorize.authorizeFunction(token, roles);

    if (!isAuth) {
        throw new functions.https.HttpsError('permission-denied', 'Role Based Error!!');
    } else {
        try {
            return calback();
        } catch (error) {
            throw new functions.https.HttpsError('internal', error);
        }
    }
}

exports.getUserInfo = functions.https.onCall(async (parms, context) => {

    return await excuteFunction(context, parms.token, async () => {

        const users = await userService.getUser(context.auth!.uid);
        return users;

    });

});

exports.getUsers = functions.https.onCall(async (params, context) => {

    return await excuteFunction(context, params.token, async () => {

        const users = await userService.getAllUsers();
        return users;

    }, Role.Admin);
});

exports.searchCustomer = functions.https.onCall(async (params, context) => {

    return await excuteFunction(context, params.token, async () => {

        const customers = await customerService.searchCustomer(params.data);
        return customers;

    }, [Role.Account, Role.Admin, Role.None]);
});
