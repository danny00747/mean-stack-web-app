const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

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
