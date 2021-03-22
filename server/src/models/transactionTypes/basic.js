const mongoose = require('mongoose');
const  Transaction = require('../transaction')

const basicTransactionSchema = new mongoose.Schema({
    subtype: {
        type: String,
        required: true,
        enum: ['income', 'expense']
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    }
});

transactionSchema.pre('save', async function(next) {
    const transaction = this;

    if (transaction.amount < 0 ) {
        throw new Error("All incoming data must contain positive 'amount' value");
    }

    if (transaction.type === 'expense') {
        transaction.amount = transaction.amount * (-1);
    }

    next();
});


const basicTransaction = Transaction.discriminator('basic', basicTransactionSchema);

module.exports = basicTransaction;
