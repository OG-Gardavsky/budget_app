const mongoose = require('mongoose');
const Transaction = require('./transaction');

const options = { discriminatorKey: 'type' };

const accountSchema = new mongoose.Schema({
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
        trim: true,
        enum: ['CZK', 'USD', 'EUR']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},
    options
);

accountSchema.virtual('transactions', {
    ref: 'Transaction',
    localField: '_id',
    foreignField: 'accountId'
});

//pre-save - at je to jmenove unikatni per user

/**
 * removing transactions with account
 */
accountSchema.pre('remove', async function (next) {
    const account = this;
    await Transaction.deleteMany({ accountId: account._id });
    next();
});

const Account = mongoose.model('Account', accountSchema);


/**
 *
 * @type {module:mongoose.Schema<Document, Model<any, any>, undefined>}
 */
const cashSchema = new mongoose.Schema({
    initialBalance: {
        type: Number,
        required: true,
        default: 0
    }
},
    options
);

Account.discriminator('cash', cashSchema);

/**
 *
 * @type {module:mongoose.Schema<Document, Model<any, any>, undefined>}
 */
const debitSchema = new mongoose.Schema({
        initialBalance: {
            type: Number,
            required: true,
            default: 0
        }
    },
    options
);
Account.discriminator('debit', debitSchema);





module.exports = Account;
