const mongoose = require('mongoose');

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


categorySchema.methods.toJSON = function() {
    const category = this;
    const categoryObject = category.toObject();

    delete categoryObject.owner;

    return categoryObject;
}

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;