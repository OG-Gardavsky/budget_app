const express = require('express');
const auth = require('../middleware/auth');
const Account = require('../models/account');
const Transaction = require('../models/transaction');

const router = new express.Router();

const baseUrl = '/api/stats';


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

module.exports = router;
