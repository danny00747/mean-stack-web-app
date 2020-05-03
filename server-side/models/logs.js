const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Logs Schema
const logSchema = new mongoose.Schema({

    host: {
        type: String,
        required: true
    },
    level: {
        type: String,
    },
    method: {
        type: String,
        required: true
    },
    requestId: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true
    },
    status: {
        type: Number,
    },
    response: {
        type: String,
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }

});

logSchema.methods.logger = async (loginfo) => {



};

logSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Logs', logSchema);
