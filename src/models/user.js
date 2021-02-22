const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("node/crypto");

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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

},
    {
        timestamp: true
    }
);

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'ggdf');

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}

const User = mongoose.model('User', userSchema);

modules.exports = User;