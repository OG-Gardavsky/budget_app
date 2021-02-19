const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is not valid');
            }
        }        
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        validate(value) {
            if(value.toLowerCase().includes('password')){
                throw new Error('password cannot include word \'password\'');
            }
        }
    }
});

const User = mongoose.model('User', userSchema);

modules.exports = User;