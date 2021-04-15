const express = require('express');
const auth = require('../middleware/auth');
const Account = require('../models/account');
const Transaction = require('../models/transaction');

const router = new express.Router();

const baseUrl = '/api/stats';

/**
 * API gets total income/expenses in given month/year
 */
router.get(baseUrl + '/total/type::type', auth, async (req, res) => {
    let transactionsType = req.params.type.toLowerCase();
    const allowedTypes = ['income', 'expense'];
    if (!allowedTypes.includes(transactionsType)) {
        return res.status(400).send({ error: 'Invalid params, types can be only ' + allowedTypes.toString() });
    }

    if (!req.query.month) {
        return res.status(400).send({ error: 'missing paramt \'month\' - should be in range 1-12'});
    }
    const month = Number(req.query.month);
    if (month < 1 || month > 12) {
        return res.status(400).send({ error: 'invalid range of month - should be 1-12'});
    }

    const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();

    try {
        const totalSum = await Transaction.aggregate([
                { $match: { owner: req.user._id, type: 'basic', subtype: transactionsType}},
                { "$project": {
                        "amount": 1,
                        "month": { "$month": "$accountingDate" },
                        "year": { "$year": "$accountingDate" }
                    }},
                { $match: { month: month, year : year }},
                {"$group" :
                        {
                            _id: "$month",
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

        res.send(totalSum);
    } catch (e) {
        res.status(500).send(e);
    }
});

/**
 * API gets stats grupped by category for basic transactions - income/expense
 */
router.get(baseUrl + '/type::type', auth, async (req, res) => {
    let transactionsType = req.params.type.toLowerCase();
    const allowedTypes = ['income', 'expense'];
    if (!allowedTypes.includes(transactionsType)) {
        return res.status(400).send({ error: 'Invalid params, types can be only ' + allowedTypes.toString() });
    }

    if (!req.query.month) {
        return res.status(400).send({ error: 'missing paramt \'month\' - should be in range 1-12'});
    }
    const month = Number(req.query.month);
    if (month < 1 || month > 12) {
        return res.status(400).send({ error: 'invalid range of month - should be 1-12'});
    }

    const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();

    try {
        const categoryStats = await Transaction.aggregate([
                { $match: { owner: req.user._id, type: 'basic', subtype: transactionsType}},
                { "$project": {
                        "amount": 1,
                        "categoryId": 1,
                        "month": { "$month": "$accountingDate" },
                        "year": { "$year": "$accountingDate" }
                    }},
                { $match: { month: month, year : year }},
                {"$group" :
                        {
                            _id:"$categoryId",
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

        await req.user.populate({
            path: 'categories'
        }).execPopulate();

        const summedCategories = [];
        req.user.categories.forEach((category) => {
            const match = categoryStats.find(obj => obj._id.toString() === category._id.toString());
            if (!match) { return }
            summedCategories.push( { categoryName: category.name, categoryId: category._id, sum: match.sum } );
        });

        res.send(summedCategories);
    } catch (e) {
        res.status(500).send(e);
    }
});

/**
 * API gets total balance of money on basic/debt accounts
 */
router.get(baseUrl + '/balance', auth, async (req, res) => {

    const accountTypeQuery = {};
    const allowedTypes = ['basic', 'invest', 'debt', 'all'];

    let typeInRequest = null;

    if (req.query.type) {
        typeInRequest = req.query.type.toLowerCase();
        if (!allowedTypes.includes(typeInRequest)) {
            return res.status(400).send({ error: 'Invalid params, types can be only ' + allowedTypes.toString() });
        }

        if (typeInRequest === 'basic') {
            accountTypeQuery.type = { $in: ['debit','cash', 'credit'] };
        } else if (typeInRequest === 'all') {
            accountTypeQuery.type = { $in: ['debit','cash', 'credit', 'debt'] };
        } else {
            accountTypeQuery.type = typeInRequest;
        }
    }


    try {

        await req.user.populate({
            path: 'accounts',
            match: accountTypeQuery
        }).execPopulate();
        const accountIds = req.user.accounts.map(acc => acc._id);

        const transactionsSum = await Transaction.aggregate([
                { $match: { owner: req.user._id,  accountId: { $in: accountIds } } },
                {"$group" :
                        {
                            _id:1,
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

        const initialBalanceSum = await Account.aggregate([
                { $match: { owner: req.user._id,  type: accountTypeQuery.type } },
                {"$group" :
                        {
                            _id:1,
                            balance: { $sum: '$initialBalance' }
                        }
                }
            ],
            (e) => {
                if (e) {
                    throw new Error('error in DB agregation');
                }
            }
        );


        const totalSum = Number(initialBalanceSum[0].balance) + Number(transactionsSum[0].balance);

        res.send({type: typeInRequest, sum: totalSum });
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;
