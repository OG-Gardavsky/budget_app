const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const { jwtKey } = require("../config/constants");
const { forgottenPasswordSend } = require('../utils/emailSending')


const router = new express.Router();

const baseUrl = '/api/users';

/**
 * API creates new user
 */
router.post(baseUrl, async (req, res) => {

    try {
        const isSameEmail = req.body.email ? await User.find({ email: req.body.email.toLowerCase() }) : [];

        if (isSameEmail.length > 0) {
            return res.send({error: 'Email adrres is already taken'});
        }

        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch (e) {
        res.status(400).send({error: e.toString()});
    }
});


/**
 * API logs in user and return user info and jwt token
 */
router.post(baseUrl + '/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email.toLowerCase(), req.body.password);
        const token = await user.generateAuthToken();
        user.resetToken = undefined;
        user.save();
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

router.put(baseUrl + '/currency', auth, async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['primarCurrency'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid body of request, in request should be only fields ' + allowedUpdates.toString() });
    }

    try {

        req.user.primarCurrency = req.body.primarCurrency;
        req.user.save();

        res.send({message: 'currency changed succesfully'});
    } catch (e) {
        res.status(500).send();
    }
});


/**
 * API changes user password
 */
router.put(baseUrl + '/password', auth, async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['oldPassword', 'newPassword'];
    const isValidOperation = allowedUpdates.every(update => updates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid body of request, in request should be only fields \'oldPassword\' and \'newPassword\' ' });
    }

    if (req.body.newPassword === null || req.body.newPassword.length < 10) {
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
 * endpoint serves for requesting password reset
 */
router.post(baseUrl + '/passwordResetRequest', async(req, res) => {
    try {

        const user = await User.findOne({ email: req.body.email.toLowerCase() } );

        if (!user) {
            return res.send();
        }

        const resetToken = await user.generateResetToken();


        const resetLink = `https://${req.get('host')}/#/passwordReset?token=${resetToken}`;

        await forgottenPasswordSend(user.email, resetLink)

        res.send();
    } catch (e) {
        res.status(400).send();
    }
});

/**
 * endpoint chcecks if new token is valid
 */
router.get(baseUrl + '/isResetTokenValid/token::token', async(req, res) => {

    const token = req.params.token;

    try {
        const decodedToken = jwt.verify(token, jwtKey);

        const user = await User.findOne({ _id: decodedToken._id, resetToken: token});

        if (!user) {
            return  res.status(400).send({error: 'Invalid reset link, request new reset one.'});
        }

        res.send();

    } catch (e) {
        res.status(400).send({error: 'Invalid reset link, request new reset one.'});
    }
});


router.post(baseUrl + '/passwordReset', async(req, res) => {

    const requiredFields = ['token', 'newPassword']
    const bodyKeys = Object.keys(req.body);

    const containRequiredFields = requiredFields.every(field => bodyKeys.includes(field));

    if (!containRequiredFields) {
        return res.status(400).send({error: 'Mising one of required properties' + requiredFields.toString() } );
    }

    try {

        const decodedToken = jwt.verify(req.body.token, jwtKey);
        const user = await User.findOne({ _id: decodedToken._id, resetToken: req.body.token});

        if (!user) {
            return res.send({error: 'Error during password reset, request new reset link'})
        }

        user.password = req.body.newPassword;
        user.tokens = [];
        const token = await user.generateAuthToken();
        user.resetToken = undefined;
        await user.save();

        res.send({user, token});

    } catch (e) {
        res.status(400).send({error: e.toString()});
    }
});


/**
 * API deletes current user account
 */
router.delete(baseUrl + '/me', auth, async (req, res) => {

    if (!req.body.password) {
        return res.send({error: 'Missing password for confirmation'})
    }

    try {
        const isOldPasswValid = await bcrypt.compare(req.body.password, req.user.password);
        if (!isOldPasswValid){
            return res.status(400).send({error: 'Entered password is incorrect'});
        }

        await req.user.remove();
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }
})


module.exports = router;
