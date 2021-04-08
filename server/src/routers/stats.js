const express = require('express');
const auth = require('../middleware/auth');
const Account = require('../models/account');
const Transaction = require('../models/transaction');

const router = new express.Router();

const baseUrl = '/api/stats';

/**
 * API creates new account
 */
router.get(baseUrl + '/type::type', auth, async (req, res) => {

    let transactionsType = req.params.type.toLowerCase();
    const allowedTypes = ['income', 'expense'];

    if (!allowedTypes.includes(transactionsType)) {
        return res.status(400).send({ error: 'Invalid params, types can be only ' + allowedTypes.toString() });
    }


    try {
        const categoryStats = await Transaction.aggregate([
                { $match: { owner: req.user._id, subtype: transactionsType} },
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
            console.log(!match)
            if (!match) { return };
            summedCategories.push( { categoryName: category.name, categoryId: category._id, sum: match.sum } );
        });

        res.send(summedCategories);
    } catch (e) {
        res.status(500).send(e);
    }

});

module.exports = router;
