const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['income', 'expense', 'investment', 'transfer']
    },
    //add check for .00 max 2 numbers after .00
    amount: {
        type: Number,
        required: true,
        trim: true,
        validate(value) {
            if (value>0) {
                throw new Error('number must be positive');
            }

            const reg = new RegExp('^\\d*.\\d{0,2}$');

            if (!reg.test(value)) {
                throw new Error('number must contain max 2 decimals')
            }
        }
    },
    currency: {
        type: String,
        required: true,
        trim: true,
        enum: ['CZK', 'USD', 'EUR']
    },
    category: {
        type: String,
        required: true,
        trim: true
        // ,
        // validate(){
        //    navalidovat to tak at to musi byt kategorie asociovana s tim uctem - mozna pridat az v routeru
        // }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;