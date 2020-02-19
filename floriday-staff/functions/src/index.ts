
import * as functions from 'firebase-functions';
import * as express from 'express';
import * as bodyParser from 'body-parser';
const admin = require('firebase-admin');
const app = express();
const main = express();

// admin.initializeApp(functions.config().firebase);
const serviceAccount = require("../serviceAccountKey.json");

const defaultApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://lorid-e9c34.firebaseio.com"
});

const defaultAuth = defaultApp.auth();
// const defaultDb = defaultApp.database();

main.use('/api/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));
// webApi is your functions name, and you will pass main as 
// a parameter

app.post('/confirm', (req, res) => {

    res.status(200).send('get from functions');
})

app.get('/user', (req, res) => {

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

app.post('/createUser', (req, res) => {
    defaultAuth.createUser({
        email: 'user@example.com',
        emailVerified: false,
        phoneNumber: '+11234567890',
        password: 'secretPassword',
        displayName: 'John Doe',
        photoURL: 'http://www.example.com/12345678/photo.png',
        disabled: false
    })
        .then((userRecord: any) => {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log('Successfully fetched user data:', userRecord.toJSON());

            res.status(200).send(userRecord.toJSON());
        })
        .catch(function (error: any) {
            res.status(403).send(error);
        });
})

export const webApi = functions.https.onRequest(main);