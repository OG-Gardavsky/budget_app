const express = require('express');
const Transaction = require('../models/transaction');
const auth = require('../middleware/auth');

const router = new express.Router()

/**
 * API creates transaction
 */
router.post('/transactions', auth, async (req, res) => {

    // chcecks if acccountId belongs to user
    await req.user.populate({
        path: 'accounts'
    }).execPopulate();

    if (req.user.accounts.length < 1) {
        return res.status(404).send({error: 'User has no created accounts'});
    }

    const allowedAcountIds = [];
    req.user.accounts.forEach((account) => allowedAcountIds.push(account._id.toString()));

    const belongsAccToUser = allowedAcountIds.includes(req.body.accountId);
    if (!belongsAccToUser) {
        return res.status(403).send({error: 'Entered acount does not belong to user.'});
    }


    const transaction = new Transaction({
        //... copies content of req.body
        ...req.body,
        owner: req.user._id
    });

    try {
        await transaction.save();
        res.status(201).send(transaction);
    } catch (e) {
        res.status(400).send(e);
    }
});



/**
 * API deletes transaction by ID
 */
router.delete('/transactions/id::id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const transaction = await Transaction.findOne({_id, owner: req.user._id});

        if (!transaction) {
            return res.status(404).send();
        }

        transaction.remove();

        res.send(transaction);
    } catch (e) {
        res.status(500).send();
    }
})



//vyrobit to logiku pro transfery -
// mozna pridat typy - transferIn/out
// nebo specifikovat incoming account a outcomming account


module.exports = router;