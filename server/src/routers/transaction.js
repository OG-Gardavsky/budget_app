const express = require('express');
const Transaction = require('../models/transaction');
const auth = require('../middleware/auth');
const ObjectID = require("bson-objectid");
const {ObjectId} = require("bson");

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
 * API creates transfer between 2 accounts
 */
router.post(baseUrl + '/transfer', auth, async (req, res) => {

    // chcecks if acccountId belongs to user
    await req.user.populate({
        path: 'accounts'
    }).execPopulate();

    if (req.user.accounts.length < 1) {
        return res.status(404).send({error: 'User has no created accounts'});
    }


    if (!req.body.givingAccountId){
        return res.status(400).send({error: "In request is missing required property 'givingAcountId'" });
    }
    if (!req.body.receivingAccountId){
        return res.status(400).send({error: "In request is missing required property 'receivingAcountId'" });
    }

    const allowedAcountIds = [];
    req.user.accounts.forEach((account) => allowedAcountIds.push(account._id.toString()));

    const belongsGivingAccToUser = allowedAcountIds.includes(req.body.givingAccountId);
    const belongsreceivingAccToUser = allowedAcountIds.includes(req.body.receivingAccountId);

    if (!belongsreceivingAccToUser || !belongsGivingAccToUser) {
        return res.status(403).send({error: 'Entered acounts does not belong to user or does not exist.'});
    }

    const sharedId = ObjectID();

    const transferIn = new Transaction({
        type:'transfer',
        subtype: 'in',
        sharedId,
        accountId: req.body.receivingAccountId,
        amount: Math.abs(req.body.amount),
        owner: req.user._id
    });

    const transferOut = new Transaction({
        type:'transfer',
        subtype: 'out',
        sharedId,
        accountId: req.body.givingAccountId,
        amount: Math.abs(req.body.amount) * (-1),
        owner: req.user._id
    });

    if (req.body.accountingDate) {
        transferIn.accountingDate = req.body.accountingDate;
        transferOut.accountingDate = req.body.accountingDate;
    }



    try {
        await transferIn.save();
        await transferOut.save();
        res.status(201).send({message: 'Transfer was successful', transferIn, transferOut});
    } catch (e) {
        res.status(400).send(e);
    }
});

/**
 * API takes care of debts
 */
router.post(baseUrl + '/debt', auth, async (req, res) => {

    const receivedBodyKeys = Object.keys(req.body);
    const requiredBodyKeys = ['subtype', 'basicAccountId', 'debtAccountId', 'amount'];
    const isValidOperation = requiredBodyKeys.every(key => receivedBodyKeys.includes(key));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid body of request, in request need to be theese fields ' + requiredBodyKeys.toString()});
    }

    if (req.body.amount < 0) {
        return res.status(400).send({ error: 'Amount has to be > 0' } );
    }

    if ( !['lend', 'borrow'].includes(req.body.subtype) ) {
        return res.status(400).send({ error: "invalid subtype, should be just 'lend' or 'borrow'"});
    }

    try {
        await req.user.populate({
            path: 'accounts',
            match: {
                _id: { $in: [req.body.basicAccountId, req.body.debtAccountId] }
            }
        }).execPopulate();

        if (req.user.accounts.length !== 2) {
            return res.status(400).send({ error: 'invalid account IDs entered'});
        }

        const basicAccount = req.user.accounts.find(acc => acc._id.toString() === req.body.basicAccountId.toString())
        const debtAccount = req.user.accounts.find(acc => acc._id.toString() === req.body.debtAccountId.toString())

        if (!['credit', 'debit', 'cash'].includes(basicAccount.type) ) {
            return res.status(400).send({ error: 'basicAccountId should correspond to ID of account type: debit, credit cash'});
        }  else if (debtAccount.type !== 'debt') {
            return res.status(400).send({ error: 'debtAccountId should correspond to ID of account type: debt'});
        }

        const sharedId = ObjectID();
        const commonTransactionBody = {
            type: 'debt',
            subtype: req.body.subtype,
            sharedId,
            owner: req.user._id
        }

        if (req.body.accountingDate) {
            commonTransactionBody.accountingDate = req.body.accountingDate;
        }

        const basicAccountTransactionBody = Object.assign({}, commonTransactionBody) ;
        basicAccountTransactionBody.amount = req.body.subtype === 'lend' ? req.body.amount * (-1) : req.body.amount;
        basicAccountTransactionBody.accountId = basicAccount._id;

        const debtAccountTransactionBody = Object.assign({}, commonTransactionBody);
        debtAccountTransactionBody.amount = req.body.subtype === 'borrow' ? req.body.amount * (-1) : req.body.amount;
        debtAccountTransactionBody.accountId = debtAccount._id;


        const basicTransaction = new Transaction(basicAccountTransactionBody);
        const debtTransaction = new Transaction(debtAccountTransactionBody);

        await basicTransaction.save();
        await debtTransaction.save();

        res.status(201).send({message: 'Debt was successfully created.', basicTransaction, debtTransaction});

    } catch (e) {
        res.status(400).send(e);
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
        res.status(500).send();
    }
});

/**
 * API gets transfer info, based on sharedId
 */
router.get(baseUrl + '/transfer/sharedId::id', auth, async (req, res) => {
    const sharedId = req.params.id;

    try {
        const transactions = await Transaction.find({sharedId: new ObjectId(sharedId), owner: req.user._id, type: 'transfer'});

        if (transactions.length !== 2){
            return res.status(400).send({ error: 'Entered transaction does not exist.'});
        }

        const bodyToSend = {};

        transactions.forEach((transaction) => {
            if (transaction.subtype === 'in') {
                bodyToSend.receivingAccountId = transaction.accountId;
                bodyToSend.amount = transaction.amount;
                bodyToSend.name = transaction.name;
            } else if (transaction.subtype === 'out') {
                bodyToSend.givingAccountId = transaction.accountId;
            }
        });

        res.send(bodyToSend);

    } catch (e) {
        res.status(500).send();
    }
});

/**
 * API gets debts info, based on sharedId
 */
router.get(baseUrl + '/debt/sharedId::id', auth, async (req, res) => {
    const sharedId = req.params.id;

    try {
        const transactions = await Transaction.find({sharedId: new ObjectId(sharedId), owner: req.user._id, type: 'debt'});

        if (transactions.length !== 2){
            return res.status(400).send({ error: 'Entered transaction does not exist.'});
        }

        const bodyToSend = {};

        await req.user.populate({
            path: 'accounts'
        }).execPopulate();

        const basicAccountsIds = req.user.accounts.filter(acc => ['credit', 'debit', 'cash'].includes(acc.type)).map(acc => acc._id.toString());
        const debtAccountsIds = req.user.accounts.filter(acc => acc.type === 'debt' ).map(acc => acc._id.toString());

        const basicAccountTransaction = transactions.find(transaction => basicAccountsIds.includes(transaction.accountId.toString()) );
        const debtAccountTransaction = transactions.find(transaction => debtAccountsIds.includes(transaction.accountId.toString()) );


        bodyToSend.subtype = basicAccountTransaction.subtype;
        bodyToSend.basicAccountId = basicAccountTransaction.accountId;
        bodyToSend.debtAccountId = debtAccountTransaction.accountId;
        bodyToSend.amount = Math.abs(basicAccountTransaction.amount);
        bodyToSend.name = basicAccountTransaction.name;


        res.send(bodyToSend);

    } catch (e) {
        res.status(500).send();
    }
});

/**
 * API updates basic transaction
 */
router.put(baseUrl + '/basic/id::id' , auth, async (req, res) => {

    const transactionId = req.params.id;

    const updates = Object.keys(req.body);
    const allowedUpdates = ['subtype', 'amount', 'categoryId', 'accountId', 'name', 'currency', 'accountingDate'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid body of request, in request should be only fields ' + allowedUpdates.toString()});
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
 * API updates transfers
 */
router.put(baseUrl + '/transfer/sharedId::id' , auth, async (req, res) => {

    const sharedId = req.params.id;

    const updates = Object.keys(req.body);
    const allowedUpdates = ['amount', 'name', 'givingAccountId', 'receivingAccountId', 'accountingDate'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid body of request, in request should be only fields ' + allowedUpdates.toString()});
    }

    try {
        const transactions = await Transaction.find({sharedId: new ObjectId(sharedId), owner: req.user._id, type: 'transfer'});

        if (![1,2].includes(transactions.length)) {
            return res.status(400).send({ error: 'Entered accounts either does not work or does not belong to user'});
        }

        const transferIn = transactions.find(transaction => transaction.subtype === 'in');
        const transferOut = transactions.find(transaction => transaction.subtype === 'out');

        updates.forEach((update) => {
            if (update === 'amount') {
                transferIn.amount = Math.abs(req.body[update]);
                transferOut.amount = Math.abs(req.body[update]) * (-1);
                return;
            } else if (update === 'givingAccountId') {
                transferOut.accountId = req.body[update];
                return;
            } else if (update === 'receivingAccountId') {
                transferIn.accountId = req.body[update];
                return;
            }

            transferIn[update] = req.body[update];
            transferOut[update] = req.body[update];
        });

        await transferIn.save();
        await transferOut.save();

        res.send(transactions);

    } catch (e) {
        res.status(500).send();
    }
});

/**
 *  API updates debt records
 */
router.put(baseUrl + '/debt/sharedId::id' , auth, async (req, res) => {

    const sharedId = req.params.id;

    const updates = Object.keys(req.body);
    const allowedUpdates = ['subtype', 'basicAccountId', 'debtAccountId', 'amount', 'accountingDate', 'name'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid body of request, in request should be only fields ' + allowedUpdates.toString()});
    }

    try {
        const transactions = await Transaction.find({sharedId: new ObjectId(sharedId), owner: req.user._id, type: 'debt'});

        if (![1,2].includes(transactions.length)) {
            return res.status(400).send({ error: 'Entered accounts either does not work or does not belong to user'});
        }

        await req.user.populate({
            path: 'accounts'
        }).execPopulate();

        const allUsersAccountsId = req.user.accounts.map(acc => acc._id.toString())
        const areValidAccounts = [req.body.basicAccountId, req.body.debtAccountId].every(account => allUsersAccountsId.includes(account));
        if (!areValidAccounts) {
            return res.status(400).send({ error: 'entered accounts does not belong to user'});
        }

        const basicAccount = req.user.accounts.find(account => account._id.toString() === req.body.basicAccountId && ['credit', 'debit', 'cash'].includes(account.type));
        const debtAccount = req.user.accounts.find(account => account._id.toString() === req.body.debtAccountId &&  account.type === 'debt');

        if (!basicAccount || !debtAccount) {
            return res.status(400).send({ error: 'entered accounts are not of correct type'});
        }

        const basicAccountsIds = req.user.accounts.filter(acc => ['credit', 'debit', 'cash'].includes(acc.type)).map(acc => acc._id.toString());
        const debtAccountsIds = req.user.accounts.filter(acc => acc.type === 'debt' ).map(acc => acc._id.toString());

        const basicAccountTransaction = transactions.find(transaction => basicAccountsIds.includes(transaction.accountId.toString()) );
        const debtAccountTransaction = transactions.find(transaction => debtAccountsIds.includes(transaction.accountId.toString()) );

        updates.forEach((update) => {
            if (update === 'subtype') {

                if (req.body.subtype !== basicAccountTransaction.subtype) {
                    basicAccountTransaction.amount *= (-1);
                    debtAccountTransaction.amount *= (-1);

                    basicAccountTransaction.subtype = req.body.subtype;
                    debtAccountTransaction.subtype = req.body.subtype;

                    return;
                }
                return;

            } else if (update === 'amount') {

                if (basicAccountTransaction.subtype === 'lend') {
                    basicAccountTransaction.amount = req.body.amount * (-1);
                    debtAccountTransaction.amount = req.body.amount;
                } else if (basicAccountTransaction.subtype === 'borrow') {
                    basicAccountTransaction.amount = req.body.amount ;
                    debtAccountTransaction.amount = req.body.amount * (-1);
                }

                return;
            } else if (update === 'basicAccountId') {
                basicAccountTransaction.accountId = req.body[update];
                return;
            } else if (update === 'debtAccountId') {
                debtAccountTransaction.accountId = req.body[update];
                return;
            }
            basicAccountTransaction[update] = req.body[update];
            debtAccountTransaction[update] = req.body[update];
        });

        await basicAccountTransaction.save();
        await debtAccountTransaction.save();

        res.send({message: 'udpate was succesfull', basicAccountTransaction, debtAccountTransaction } );

    } catch (e) {
        res.status(500).send(e);
        console.log(e);
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

        if (['transfer', 'debt'].includes(transaction.type)) {
            const transactions = await Transaction.find({sharedId: transaction.sharedId, owner: req.user._id});
            await Transaction.deleteMany({sharedId: transaction.sharedId, owner: req.user._id});
            return res.send(transactions);
        }

        transaction.remove();

        res.send(transaction);
    } catch (e) {
        res.status(500).send();
    }
})


module.exports = router;
