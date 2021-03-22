const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['income', 'expense', 'transferIn', 'transferOut']
    },
    //add check for .00 max 2 numbers after .00
    amount: {
        type: Number,
        required: true,
        trim: true,
        validate(value) {
            const reg = new RegExp('^-?\\d*.\\d{0,2}$');

            if (!reg.test(value)) {
                throw new Error('number must contain max 2 decimals')
            }
        }
    },
    currency: {
        type: String,
        required: false,
        trim: true,
        enum: ['CZK', 'USD', 'EUR']
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Category'
    }
});

transactionSchema.pre('save', async function(next) {
    const transaction = this;

    if (transaction.amount < 0 && transaction.type !== 'transferOut') {
        throw new Error("All incoming data must contain positive 'amount' value");
    }

    if (transaction.type === 'expense') {
        transaction.amount = transaction.amount * (-1);
    }

    next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
