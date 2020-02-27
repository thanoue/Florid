const express = require('express');
const router = express.Router();
import * as userService from './user.service';

// routes
router.post('/authenticate', authenticate);
router.get('/', getAll);

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
