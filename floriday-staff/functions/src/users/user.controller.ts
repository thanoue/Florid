const express = require('express');
const userRouter = express.Router();
import * as userService from './user.service';
const blacklist = require('express-jwt-blacklist');

// routes
userRouter.post('/login', authenticate);
userRouter.get('/', getAll);
userRouter.post('/logout', logout);

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
