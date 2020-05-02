const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Logs Schema
const logSchema = new mongoose.Schema({

    host: {
        type: String,
        require: true
    },
    level: {
        type: String,
    },
    method: {
        type: String,
        require: true
    },
    url: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true
    },
    date: {
        type: String,
        require: true
    }

});

logSchema.methods.logger = async (loginfo) => {



};

logSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Logs', logSchema);
