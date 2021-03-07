const mongoose = require('mongoose');

//can be added subtype - if is income | expense - podle toho check u vytvareni transakce
// also can be added, if is global or just for one user

const categorySchema = new mongoose.Schema({
    name: {
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

categorySchema.virtual('transactions', {
    ref: 'Transaction',
    localField: '_id',
    foreignField: 'categoryId'
});



categorySchema.methods.toJSON = function() {
    const category = this;
    const categoryObject = category.toObject();

    delete categoryObject.owner;

    return categoryObject;
}

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;