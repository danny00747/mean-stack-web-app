import makeQuestionDb from './question-db'
//import mongodb from 'mongodb'

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//const MongoClient = mongodb.MongoClient;
//const url = process.env["DM_COMMENTS_DB_URL"];
//const dbName = process.env["DM_COMMENTS_DB_NAME"];
//const client = new MongoClient(url, { useNewUrlParser: true });

const questionSchema = new mongoose.Schema({

    type: {
        type: String,
        require: true,
        enum: ["multiple", "boolean", "fill in"]
    },
    question: {
        type: String,
        required: true,
    },
    answers: [
        {
            option: {
                type: String,
                required: true
            },
            isCorrect: {
                type: String,
                required: true,
                default: false
            }
        }
    ]
});

questionSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Question', questionSchema, 'questions');
