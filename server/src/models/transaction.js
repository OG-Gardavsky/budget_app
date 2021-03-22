const mongoose = require('mongoose');
// require('transactionTypes/basic.js')

const options = { discriminatorKey: 'type' };

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        trim: true,
        validate(value) {
            //check for max 2 decimals
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
    name: {
        type: String,
        required: false,
        trim: true
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
},
    options
);


const Transaction = mongoose.model('Transaction', transactionSchema);





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
},
    options
);

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



module.exports = Transaction;
