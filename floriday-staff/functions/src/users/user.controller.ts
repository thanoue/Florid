const express = require('express');
const userRouter = express.Router();
import * as userService from './user.service';
import * as adminSdk from '../helper/admin.sdk';
const blacklist = require('express-jwt-blacklist');

// routes
userRouter.post('/login', authenticate);
userRouter.get('/', getAll);
userRouter.post('/logout', logout);
userRouter.get('/getUser', getUser);
userRouter.get('/createUser', createUser);

module.exports = userRouter;

function authenticate(req: any, res: any, next: any) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function getAll(req: any, res: any, next: any) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function logout(req: any, res: any) {
    blacklist.revoke(req.user);
    res.sendStatus(200);
}

function getUser(req: any, res: any) {
    adminSdk.defaultAuth.getUser('V2L5VyZDarfkPCoQprcxd0i8KCI2')
        .then((userRecord: any) => {
            // See the UserRecord reference doc for the contents of userRecord.
            res.status(200).send(userRecord.toJSON());
        })
        .catch(function (error: any) {
            res.status(403).send(error);
        });
}


function createUser(req: any, res: any) {
    adminSdk.defaultAuth.createUser(req.body)
        .then((userRecord: any) => {
            // See the UserRecord reference doc for the contents of userRecord.
            // var newUserKey = defauDatabase.ref().child('users').push().key;

            adminSdk.defauDatabase.ref('users').child(userRecord.uid).set({
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
}


