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
    amount: {
        type: Number,
        required: true,
        trim: true
    },
    currency: {
        type: String,
        required: true,
        trim: true
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