const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Logs Schema
const logSchema = new mongoose.Schema({

    host: {
        type: String
    },
    level: {
        type: String,
    },
    method: {
        type: String
    },
    requestId: {
        type: String
    },
    url: {
        type: String
    },
    status: {
        type: Number,
    },
    type: {
        type: String,
        enum: ["Incoming", "Outgoing"]
    },
    response: {
        type: String
    },
    message: {
        type: String
    },
    date: {
        type: String
    }

});

logSchema.methods.logger = async (loginfo) => {



};

logSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Logs', logSchema);
