
import * as functions from 'firebase-functions';
import * as bodyParser from 'body-parser';
const cors = require('cors');
import * as  userRouter from './users/user.controller';
import * as saleRouter from './sale/sale.controller';
import * as adminSdk from './helper/admin.sdk';

const express = require('express');
const jwt = require('express-jwt');
const blacklist = require('express-jwt-blacklist');
const app = new express();
const main = new express();

app.use(cors());


// app.use(function (req, res, next) {
//     req.setHeader('Content-Type', 'application/json');
//     next();
// })

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
