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

    const accountTypeQuery = {};
    const allowedTypes = ['basic', 'invest', 'debt'];

    if (req.query.type) {
        const typeInRequest = req.query.type.toLowerCase();
        if (!allowedTypes.includes(typeInRequest)) {
            return res.status(400).send({ error: 'Invalid params, types can be only ' + allowedTypes.toString() });
        }
        accountTypeQuery.type = typeInRequest === 'basic' ? { $in: ['debit','cash', 'credit'] }  : typeInRequest;
    }


    try {

        await req.user.populate({
            path: 'accounts',
            match: accountTypeQuery
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
 * API updates info of given account
 */
router.put(baseUrl + '/id::id' , auth, async (req, res) => {

    const accountId = req.params.id;

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'type', 'initialBalance', 'currency'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid body of request, in request should be only fields ' + allowedUpdates.toString()});
    }

    try {
        const account = await Account.findOne({_id: accountId, owner: req.user._id});

        if (!account){
            return res.status(400).send({ error: 'No account found'});
        }

        updates.forEach((update) => account[update] = req.body[update]);
        await account.save();
        res.send(account);

    } catch (e) {
        res.status(500).send(e);
        console.log(e)
    }
});


/**
 * API gets balance of accounts
 */
router.get(baseUrl + '/balance', auth, async (req, res) => {

    const accountTypeQuery = {};
    const allowedTypes = ['basic', 'invest', 'debt'];

    if (req.query.type) {
        const typeInRequest = req.query.type.toLowerCase();
        if (!allowedTypes.includes(typeInRequest)) {
            return res.status(400).send({ error: 'Invalid params, types can be only ' + allowedTypes.toString() });
        }
        accountTypeQuery.type = typeInRequest === 'basic' ? { $in: ['debit','cash', 'credit'] }  : typeInRequest;
    }


    try {

        await req.user.populate({
            path: 'accounts',
            match: accountTypeQuery
        }).execPopulate();
        const accountIds = req.user.accounts.map(acc => acc._id);

        const accountsBalance = await Transaction.aggregate([
                { $match: { owner: req.user._id,  accountId: { $in: accountIds } } },
                {"$group" :
                        {
                            _id:"$accountId",
                            balance: { $sum: '$amount' }
                        }
                }
            ],
            (e) => {
                if (e) {
                    throw new Error('error in DB agregation');
                }
            }
        );

        const accountsToSend = [];
        req.user.accounts.forEach((account) => {
            const match = accountsBalance.find(obj => obj._id.toString() === account._id.toString());
            let balance = !match ? Number(0) : Number(match.balance);
            balance = balance + Number(account.initialBalance);
            accountsToSend.push( { _id: account._id, name: account.name, balance: balance,  currency: account.currency, initialBalance: account.initialBalance} );
        });

        res.send(accountsToSend);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get(baseUrl + '/id::id/balance', auth, async (req, res) => {
    const accountId = req.params.id;

    try {
        const account = await Account.findOne({_id: accountId, owner: req.user._id});

        if (!account) {
            return res.status(404).send();
        }

        const transactionSum = await Transaction.aggregate([
                { $match: { owner: req.user._id, accountId: account._id } },
                {"$group" :
                        {
                            _id: 1,
                            sum: { $sum: '$amount' }
                        }
                }
            ],
            (e) => {
                if (e) {
                    throw new Error('error in DB agregation');
                }
            }
        );


        const accountBalance = Number(transactionSum[0].sum) + Number(account.initialBalance);

        res.send({ _id: account._id, name: account.name, balance: accountBalance, currency: account.currency, initialBalance: account.initialBalance })

    } catch (e) {
        res.status(500).send();
    }
});


/**
 * API gets details of one given transaction
 */
router.get(baseUrl + '/id::id/transactions', auth, async (req, res) => {
    const accountId = req.params.id;

    const sort = {};
    if (req.query.sort) {
        sort.accountingDate = req.query.sort;
    }

    try {
        const account = await Account.findOne({_id: accountId, owner: req.user._id});

        if (!account) {
            return res.status(404).send();
        }

        await account.populate({
            path: 'transactions',
            options: {
                limit: parseInt(req.query.limit),
                sort
            }
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
