
import * as functions from 'firebase-functions';
import * as bodyParser from 'body-parser';
const cors = require('cors');
import * as  userRouter from './users/user.controller';
const express = require('express');
const admin = require('firebase-admin');
const jwt = require('express-jwt');
const blacklist = require('express-jwt-blacklist');
const serviceAccount = require("../serviceAccountKey.json");
const sha256 = require('js-sha256');
const app = new express();
const main = new express();

const momoConfig = {
    secretKey: 'gPefAYXMR3jQQ44bBU4oRjIzOC6Awsa0',
    partnerCode: 'MOMO6B4T20200319',
    storeId: 'florid_1',
    accessKey: 'kcWTrI6rGUHxnFlq',
    publicKey: 'MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAqxVXfFBhTYk6kOYbdPK9jx5ZH7Im5PR0g6JWhrmPbFo1mQE/vgM0uc2MH6VF/fuxQUOGFmtNnBNyZgnWYWHUCL4/fYql0AdtvwFYrSnVwbJXdyhrYSrMD1uOIgVORn1h/9WlkHKIn40YT5c/3p7GDofqwX65HanLGKDb9FJRXPtoo0yv0OVRQxL1QVvkXpQMa2ZK8mSBz04wYNw5LPvtXKEoTQTjcVSK1+JWsltaF9qOvIK4GiuqnY17uFoVcBD7cutyim4HxG7j97/ac4s0zP/48wlPNsn6vCc20XrtIhb3iGMxPrxMiQUhzvgnPcQ81a4OcUUTFMcXUTmeOYQwn8Rq/p0rQJcADyif267h/HvaJNxtowdesdxlBSlAd0JyalG8Y+7FxwsWu0YiX5PQhedJuUjj1CW86DwIM8FH9NDjvCRoo4f/Ap5F7DpJtwywrqi7nkUsD9U8EOLggk6+X5D8LsODnbuuLnpZDz281goH52ovsZhujN2SE3ErXaXF7YPvRxPVMd+m4VYW+fGtK5JU4rfFkux+W5WId7EaWxNdP0E5eMcMQhnbuBZQAvFG+KxN11GKc7RHtJM+9hBfBvMRiL7MtXDrbLOiipBigRXyxBX85zwuepi7YQAhDeuktQI9bpEB+R+xU7PZHMdXZ5b/zNnB8dc/pE+7ZFmFWSkCAwEAAQ=='
};

const defaultApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://lorid-e9c34.firebaseio.com"
});

const defaultAuth = defaultApp.auth();
const defauDatabase = defaultApp.database();
// const defaultDb = defaultApp.database();

main.use('/api/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));


app.use(cors());

app.use(jwt({ secret: "KHOIDEPTRAIAHIIH", isRevoked: blacklist.isRevoked }).unless({
    path: [
        // public routes that don't require authentication
        '/api/v1/users/login',
        '/api/v1/momoconfirm'
    ]
}));


app.use('/users', userRouter);

app.post('/momoconfirm', (req: any, res: any) => {

    const status = parseInt(req.body.status);

    if (status === 0) {

        const rawReqSig = `accessKey=${req.body.accessKey}&amount=${req.body.amount}&message=${req.body.message}&momoTransId=${req.body.momoTransId}
        &partnerCode=${req.body.partnerCode}&partnerRefId=${req.body.partnerRefId}&partnerTransId=${req.body.partnerTransId}
        &responseTime=${req.body.responseTime}&status=${req.body.status}&storeId=${req.body.storeId}&transType=momo_wallet`;

        const reqSig = sha256.hmac.create(momoConfig.secretKey).update(rawReqSig).hex();

        if (!reqSig === req.body.signature) {
            res.status(400).send("Authorize error!!!");
        } else {

            const rawSignature = `amount=${req.body.amount}&message=${req.body.message}&momoTransId=${req.body.momoTransId}&partnerRefId=${req.body.partnerRefId}&status=${req.body.status}`;

            const signature = sha256.hmac.create(momoConfig.secretKey).update(rawSignature).hex();

            defauDatabase.ref('momoTrans/' + req.body.partnerRefId).set({
                Id: req.body.partnerRefId,
                MomoTransId: req.body.momoTransId,
                Amount: parseInt(req.body.amount),
                TransType: req.body.transType,
                ResponseTime: parseInt(req.body.responseTime),
                StoreId: req.body.storeId,
                Status: status
            }, (error: any) => {

                if (error) {
                    res.status(400).send(error);
                } else {
                    res.status(200).send({
                        status: status,
                        message: req.body.message,
                        amount: parseInt(req.body.amount),
                        partnerRefId: req.body.partnerRefId,
                        momoTransId: req.body.momoTransId,
                        signature: signature
                    });
                }
            })
        }
    } else {
        res.status(400).send("trans failed");
    }
});

app.post('/confirm', (req: any, res: any) => {
    res.status(200).send('get from functions');
})

app.get('/user', (req: any, res: any) => {

    defaultAuth.getUser('V2L5VyZDarfkPCoQprcxd0i8KCI2')
        .then((userRecord: any) => {
            // See the UserRecord reference doc for the contents of userRecord.
            res.status(200).send(userRecord.toJSON());
        })
        .catch(function (error: any) {
            res.status(403).send(error);
        });
});

app.post('/createUser', (req: any, res: any) => {

    defaultAuth.createUser(req.body)
        .then((userRecord: any) => {
            // See the UserRecord reference doc for the contents of userRecord.
            // var newUserKey = defauDatabase.ref().child('users').push().key;

            defauDatabase.ref('users').child(userRecord.uid).set({
                PhoneNumber: userRecord.phoneNumber,
                FullName: userRecord.displayName,
                Email: userRecord.email,
                AvtUrl: userRecord.photoURL,
                Active: true,
                Role: req.body.roleId,
            });

            res.status(200).send(userRecord.toJSON());
        })
        .catch(function (error: any) {
            res.status(403).send(error);
        });
})

export const webApi = functions.https.onRequest(main);
