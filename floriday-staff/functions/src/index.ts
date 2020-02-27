
import * as functions from 'firebase-functions';
import * as bodyParser from 'body-parser';
const cors = require('cors');
import * as jwt from './helper/jwt';
import * as  router from './users/user.controller';


const admin = require('firebase-admin');
const app = require('express');
const main = require('express');


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


app.use(cors());

// use JWT auth to secure the api
app.use(jwt.jwt());

// api routes
app.use('/users', router);

// webApi is your functions name, and you will pass main as 
// a parameter

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
            console.log('Successfully fetched user data:', userRecord.toJSON());

            res.status(200).send(userRecord.toJSON());
        })
        .catch(function (error: any) {
            res.status(403).send(error);
        });
})

export const webApi = functions.https.onRequest(main);