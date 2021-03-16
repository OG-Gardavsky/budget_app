const express = require('express');
const auth = require('../middleware/auth');
const Account = require('../models/account');
const Transaction = require('../models/transaction');

const router = new express.Router();

const baseUrl = '/api/accounts';

/**
 * API creates new account
 */
router.post(baseUrl, auth, async (req, res) => {
    const account = new Account({
        //... copies content of req.body
        ...req.body,
        owner: req.user._id
    });

    try {
        await account.save();
        res.status(201).send(account);
    } catch (e) {
        res.status(400).send(e);
    }
});


/**
 * API gets accounts associated with user
 */
router.get(baseUrl, auth, async (req, res) => {
    try {

        await req.user.populate({
            path: 'accounts'
        }).execPopulate();

        res.send(req.user.accounts);

    } catch (e) {
        res.status(500).send(e);
    }
});

/**
 * API gets acount details by its id
 */
router.get(baseUrl + '/id::id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const account = await Account.findOne({_id, owner: req.user._id});

        if (!account) {
            return res.status(404).send();
        }

        res.send(account);
    } catch (e) {
        res.status(500).send();
    }
});

/**
 * API gets balance of accounts
 */
router.get(baseUrl + '/balance', auth, async (req, res) => {
    try {
        const accountsBalance = await Transaction.aggregate([
                { $match: { owner: req.user._id} },
                {"$group" :
                        {
                            _id:"$accountId",
                            balance: { $sum: '$amount' }
                        }
                }
            ],
            (e, result) => {
                if (e) {
                    throw new Error('error in DB agregation');
                }
            }
        );

        await req.user.populate({
            path: 'accounts'
        }).execPopulate();

        const accountsToSend = [];
        for (const account of  req.user.accounts) {
            let match = accountsBalance.find(obj => obj._id.toString() === account._id.toString());

            accountsToSend.push( { accountId: account._id, accountName: account.name, balance: match.balance,  currency: account.currency} );
        }

        res.send(accountsToSend);

    } catch (e) {
        res.status(500).send(e);

        console.log(e)
    }
});

/**
 * API gets details of one given transaction
 */
router.get(baseUrl + '/id::id/transactions', auth, async (req, res) => {
    const accountId = req.params.id;

    try {
        const account = await Account.findOne({_id: accountId, owner: req.user._id});

        if (!account) {
            return res.status(404).send();
        }

        await account.populate({
            path: 'transactions'
        }).execPopulate();

        res.send(account.transactions);
    } catch (e) {
        res.status(500).send();
    }
});


/**
 * API deletes acount by ID
 */
router.delete(baseUrl + '/id::id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
            const account = await Account.findOne({_id, owner: req.user._id});

        if (!account) {
            return res.status(404).send();
        }

        account.remove();

        res.send(account);
    } catch (e) {
        res.status(500).send();
    }
});


module.exports = router;
