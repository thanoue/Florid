
import * as functions from 'firebase-functions';
import * as bodyParser from 'body-parser';
const cors = require('cors');
import * as  router from './users/user.controller';
const express = require('express');
const admin = require('firebase-admin');
const jwt = require('express-jwt');
const blacklist = require('express-jwt-blacklist');
const serviceAccount = require("../serviceAccountKey.json");

const app = new express();
const main = new express();

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
        '/api/v1/users/login'
    ]
}));

app.use('/users', router);

app.post('/confirm', (req: any, res: any) => {

    res.status(200).send('get from functions');
})

app.get('/user', (req: any, res: any) => {

    defaultAuth.getUser('V2L5VyZDarfkPCoQprcxd0i8KCI2')
        .then((userRecord: any) => {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log('Successfully fetched user data:', userRecord.toJSON());

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
