const mongoose = require('mongoose');

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
    currency: {
        type: String,
        required: true,
        trim: true
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

const Account = mongoose.model('Account', acountSchema);

module.exports = Account;
