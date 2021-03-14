const mongoose = require('mongoose');
const constants = require('../config/constants')

mongoose.connect(constants.dbAdrres, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
