const express = require('express');
const router = express.Router();
import * as userService from './user.service';
const blacklist = require('express-jwt-blacklist');

// routes
router.post('/login', authenticate);
router.get('/', getAll);
router.post('/logout', logout);

module.exports = router;

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
