const express = require('express');
const Transaction = require('../models/transaction');
const auth = require('../middleware/auth');
const ObjectID = require("bson-objectid");

const router = new express.Router()

const baseUrl = '/api/transactions';

/**
 * API creates transaction - of type 'income' or expense
 */
router.post(baseUrl + '/basic', auth, async (req, res) => {

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
        return res.status(403).send({error: 'Entered acount does not belong to user or does not exist.'});
    }

    const transaction = new Transaction({
        //... copies content of req.body
        ...req.body,
        type: 'basic',
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
 *
 */
router.post(baseUrl + '/transfer', auth, async (req, res) => {

    // chcecks if acccountId belongs to user
    await req.user.populate({
        path: 'accounts'
    }).execPopulate();

    if (req.user.accounts.length < 1) {
        return res.status(404).send({error: 'User has no created accounts'});
    }

    const allowedAcountIds = [];
    req.user.accounts.forEach((account) => allowedAcountIds.push(account._id.toString()));


    if (!req.body.givingAcountId){
        return res.status(400).send({error: "In requesr is missing required property 'givingAcountId'" });
    }
    if (!req.body.receivingAcountId){
        return res.status(400).send({error: "In requesr is missing required property 'receivingAcountId'" });
    }

    const sharedId = ObjectID();

    const transferIn = new Transaction({
        type:'transfer',
        subtype: 'in',
        sharedId,
        accountId: req.body.receivingAcountId,
        amount: req.body.amount,
        owner: req.user._id
    });

    const transferOut = new Transaction({
        type:'transfer',
        subtype: 'out',
        sharedId,
        accountId: req.body.givingAcountId,
        amount: req.body.amount * (-1),
        owner: req.user._id
    });

    try {
        await transferIn.save();
        await transferOut.save();
        res.status(201).send({message: 'Transfer was succesfull', transferIn, transferOut});
    } catch (e) {
        res.status(400).send(e.toString());
    }
});

/**
 * API gets list of transactions associated with user
 */
router.get(baseUrl, auth, async (req, res) => {
    try {

        await req.user.populate({
            path: 'transactions'
        }).execPopulate();

        res.send(req.user.transactions);

    } catch (e) {
        res.status(500).send(e);
    }
});

/**
 * API updates basic transaction
 */
router.put(baseUrl + '/basic/id::id' , auth, async (req, res) => {

    const transactionId = req.params.id;

    const updates = Object.keys(req.body);
    const allowedUpdates = ['subtype', 'amount', 'categoryId', 'accountId', 'name', 'currency'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid body of request, in request should be only fields \'subtype\', \'amount\', \'categoryId\', \'accountId\', \'name\', \'currency\' ' });
    }

    try {
        const transaction = await Transaction.findOne({_id: transactionId, owner: req.user._id});

        updates.forEach((update) => transaction[update] = req.body[update]);
        await transaction.save();
        res.send(transaction);

    } catch (e) {
        res.status(500).send();
    }
});



/**
 * API deletes transaction by ID
 */
router.delete(baseUrl + '/id::id', auth, async (req, res) => {
    const _id = req.params.id;

    try {

        const transaction = await Transaction.findOne({_id, owner: req.user._id});

        if (!transaction) {
            return res.status(404).send();
        }


        if (transaction.type === 'transfer') {
            const transactions = await Transaction.find({sharedId: transaction.sharedId, owner: req.user._id});
            await Transaction.deleteMany({sharedId: transaction.sharedId, owner: req.user._id});
            return res.send(transactions);
        }

        transaction.remove();

        res.send(transaction);
    } catch (e) {
        res.status(500).send();
        console.log(e)
    }
})


module.exports = router;
