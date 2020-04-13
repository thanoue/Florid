const express = require('express');
const userRouter = express.Router();
import * as userService from './user.service';
import * as auth from '../helper/ authorize';
import { Role } from '../helper/role';
import * as adminSdk from '../helper/admin.sdk';
const blacklist = require('express-jwt-blacklist');

// routes
userRouter.post('/login', authenticate);
userRouter.post('/logout', logout);
userRouter.post('/createUser', auth.authorize(Role.Admin), createUser);
// userRouter.get('/', auth.authorize(Role.Admin), getAll);
// userRouter.get('/getUser', auth.authorize(Role.Admin), getUser);

module.exports = userRouter;

async function authenticate(req: any, res: any, next: any) {
    console.log('before call');
    try {
        const user = await userService.authenticate(req.body);

        if (!user) {
            res.status(400).json({ message: 'Username or password is incorrect' });
        } else {
            adminSdk.defauDatabase.ref(`/onlineUsers/${user.key}`).set({
                Id: user.key,
                Created: (new Date()).getTime()
            }, (error: any) => {
                console.log('after call');

                res.status(200).send(user);
                return;
            });

        }
    } catch (error) {
        console.log(error);
        res.status(403).send(error);
        return;
    }
}


function logout(req: any, res: any) {
    blacklist.revoke(req.user);
    res.sendStatus(200);
}

// function getUser(req: any, res: any) {
//     adminSdk.defaultAuth.getUser('V2L5VyZDarfkPCoQprcxd0i8KCI2')
//         .then((userRecord: any) => {
//             // See the UserRecord reference doc for the contents of userRecord.
//             res.status(200).send(userRecord.toJSON());
//         })
//         .catch(function (error: any) {
//             res.status(403).send(error);
//         });
// }


async function createUser(req: any, res: any) {
    try {
        const user = await userService.createUser(req);
        if (user) {
            res.status(200).send(user.toJSON());
        } else {
            res.status(500).send('ERROR!');
        }
    } catch (error) {
        res.status(500).send(error);
    }
}


