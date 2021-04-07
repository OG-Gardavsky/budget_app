const mongoose = require('mongoose');
const Transaction = require('./transaction');


const acountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['debit', 'credit', 'cash', 'invest']
    },
    initialBalance: {
        type: Number,
        required: true,
        default: 0
    },
    currency: {
        type: String,
        required: true,
        trim: true,
        enum: ['CZK', 'USD', 'EUR']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

acountSchema.virtual('transactions', {
    ref: 'Transaction',
    localField: '_id',
    foreignField: 'accountId'
});

//pre-save - at je to jmenove unikatni per user

/**
 * removing transactions with account
 */
acountSchema.pre('remove', async function (next) {
    const account = this;
    await Transaction.deleteMany({ accountId: account._id });
    next();
});

const Account = mongoose.model('Account', acountSchema);

module.exports = Account;
