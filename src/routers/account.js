const express = require('express');
const Account = require('../models/account');
const auth = require('../middleware/auth');

const router = new express.Router()


/**
 * API creates new account
 */
router.post('/accounts', auth, async (req, res) => {
    const account = new Account({
        //... copies content of req.body
        ...req.body,
        ownerId: req.user._id
    })

    try {
        await account.save()
        res.status(201).send(account)
    } catch (e) {
        res.status(400).send(e)
    }
})


/**
 * API gets accounts associated with user
 */
router.get('/accounts', auth, async (req, res) => {
    try {

        await req.user.populate({
            path: 'accounts'
        }).execPopulate()

        res.send(req.user.accounts)

    } catch (e) {
        res.status(500).send(e)
        console.log(e)
    }
})


module.exports = router;


