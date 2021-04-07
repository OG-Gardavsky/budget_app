const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');

const router = new express.Router();

const baseUrl = '/api/users';

/**
 * API creates new user
 */
router.post(baseUrl, async (req, res) => {
    const user = new User(req.body);

    try{
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch (e) {
        res.status(400).send(e);
    }
});


/**
 * API logs in user and return user info and jwt token
 */
router.post(baseUrl + '/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (e) {
        res.status(400).send();
    }
});


/**
 * API gets user account info
 */
router.get(baseUrl, auth, async (req, res) => {
    try{
        res.status(200).send(req.user);

    } catch (e) {
        res.status(400).send(e);
    }
});



/**
 * API logs out user by deleting current jwt token
 */
router.post(baseUrl + '/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })
        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
});


/**
 * API logs out user from all devices by deleting all jwt tokens
 */
router.post(baseUrl + '/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];

        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send(e);
    }
});


/**
 * API changes user password
 */
router.put(baseUrl + '/password', auth, async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['oldPassword', 'newPassword'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid body of request, in request should be only fields \'oldPassword\' and \'newPassword\' ' });
    }

    if (req.body.newPassword.length < 10) {
        return res.status(400).send({ error: 'New password is too short' });
    }

    try {
        const isOldPasswValid = await bcrypt.compare(req.body.oldPassword, req.user.password);
        if (!isOldPasswValid){
            return res.status(400).send({error: 'Old password does not match '});
        }

        req.user.password = req.body.newPassword;
        req.user.tokens = [];
        req.user.save();

        res.send({message: 'password changed succesfully'});
    } catch (e) {
        res.status(500).send();
    }
});

/**
 * API deletes current user account
 */
router.delete(baseUrl + '/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }
})


module.exports = router;
