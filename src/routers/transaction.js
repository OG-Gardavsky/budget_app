const express = require('express');
const Transaction = require('../models/transaction');
const auth = require('../middleware/auth');

const router = new express.Router()

router.post('/transactions', auth, async (req, res) => {
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
})


module.exports = router;