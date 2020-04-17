
import * as functions from 'firebase-functions';
import * as bodyParser from 'body-parser';
const cors = require('cors');
import * as userService from '././users/user.service';
import * as  userRouter from './users/user.controller';
import * as saleRouter from './sale/sale.controller';
import * as adminSdk from './helper/admin.sdk';
import * as authrorize from './helper/ authorize';
import { Role } from './helper/role';

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

exports.getUserInfo = functions.https.onCall(async (data, context) => {

    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Unauthenticated');
    }

    try {

        const users = await userService.getUser(context.auth.uid);

        return users;

    } catch (error) {
        throw new functions.https.HttpsError('internal', error);
    };

});

exports.getUsers = functions.https.onCall(async (params, context) => {

    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Unauthenticated');
    }

    const isAuth = await authrorize.authorizeFunction(params.token, [Role.Admin]);

    if (!isAuth) {
        throw new functions.https.HttpsError('unauthenticated', 'Role Based Error!!');
    }
    else {
        try {

            const users = await userService.getAllUsers();

            return users;

        } catch (error) {
            throw new functions.https.HttpsError('internal', error);
        };

    }
});
