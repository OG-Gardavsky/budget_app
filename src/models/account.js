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
    }
});

const Account = mongoose.model('Account', acountSchema);

modules.exports = Account;

const neco = new Account
