const mongoose = require('mongoose');

const options = { discriminatorKey: 'type' };

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        trim: true
    },
    // currency: {
    //     type: String,
    //     required: false,
    //     trim: true,
    //     enum: ['CZK', 'USD', 'EUR']
    // },
    name: {
        type: String,
        required: false,
        trim: true
    },
    accountingDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Account'
    }
},
    options
);


const Transaction = mongoose.model('Transaction', transactionSchema);


/**
 *
 * @type {module:mongoose.Schema<Document, Model<any, any>, undefined>}
 */
const basicTransactionSchema = new mongoose.Schema({
    subtype: {
        type: String,
        required: true,
        enum: ['income', 'expense']
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Category'
    }
},
    options
);

basicTransactionSchema.pre('save', async function(next) {
    const transaction = this;

    if (transaction.amount < 0 ) {
        throw new Error("All incoming data must contain positive 'amount' value");
    }

    if (transaction.subtype === 'expense') {
        transaction.amount = transaction.amount * (-1);
    }

    next();
});

Transaction.discriminator('basic', basicTransactionSchema);


/*****
 * **************************************************
 * @type {module:mongoose.Schema<Document, Model<any, any>, undefined>}
 */
const transferTransactionSchema = new mongoose.Schema({
        subtype: {
            type: String,
            required: true,
            enum: ['in', 'out']
        },
        sharedId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    },
    options
);

Transaction.discriminator('transfer', transferTransactionSchema);


/**
 *
 * @type {module:mongoose.Schema<Document, Model<any, any>, undefined>}
 */
const debtTransactionSchema = new mongoose.Schema({
        subtype: {
            type: String,
            required: true,
            enum: ['borrow', 'lend']
        },
        sharedId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    },
    options
);

Transaction.discriminator('debt', debtTransactionSchema);


/**
 *
 * @type {module:mongoose.Schema<Document, Model<any, any>, undefined>}
 */
const investTransactionSchema = new mongoose.Schema({
        subtype: {
            type: String,
            required: true,
            enum: ['deposit', 'withdrawal']
        },
        sharedId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    },
    options
);

Transaction.discriminator('invests', investTransactionSchema);



module.exports = Transaction;
