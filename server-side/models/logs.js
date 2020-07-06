import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

// Logs Schema
const logSchema = new mongoose.Schema({

    host: {type: String, required: true},

    level: {type: String, required: true},

    method: {type: String, required: true},

    requestId: {type: String, required: true},

    url: {type: String, required: true},

    status: {type: Number, required: true},

    type: {type: String, enum: ["Incoming", "Outgoing"]},

    message: {type: String, required: true},

    response: {type: String},

    date: {type: String}

});

logSchema.plugin(uniqueValidator);
export default mongoose.model('Logs', logSchema, 'logs');
