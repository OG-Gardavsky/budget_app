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
        enum: ['income', 'expense', 'investment']
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
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

modules.exports = Transaction;