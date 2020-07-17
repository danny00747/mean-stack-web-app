import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

// Reviews Schema
const reviewSchema = new mongoose.Schema({

    author: {type: String, required: true,},
    rating: {type: Number, required: true, min: 0, max: 10},
    reviewText: {type: String, required: true},
    created: {type: String},
    updated: {type: String}
});

const tokenSchema = new mongoose.Schema({

    userId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},

    randomKey: {type: String, required: true},

    createdOn: {type: Date, required: true, default: Date.now, expires: '2m'}
});

// Users Schema
const userSchema = new mongoose.Schema({

    username: {type: String, require: true, unique: true},

    email: {
        type: String, required: true, unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },

    password: {type: String, require: true},

    score: {type: Number, default: 0, min: 0, max: 10},

    isVerified: {type: Boolean, default: false},

    level: {type: String, default: "A1", enum: ["A1", "A2", "B1", "B2", "C1", "C2"]},

    role: {type: String, default: 'student', enum: ["student", "teacher", "admin"]},

    reviews: [reviewSchema]
});


//userSchema.index({createdAt: 1}, {expireAfterSeconds: 120,
 // partialFilterExpression: {isVerified: { $eq:false}}});

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema, 'users');
const Token = mongoose.model('Token', tokenSchema, 'tokens');
export {User, Token}


// userSchema.index({},{expireAfterSeconds: 120, partialFilterExpression: {isVerified: false}});
// createdOn: {type: Date, required: true, default: Date.now, expires: '2m', partialFilterExpression : {isVerified: false}},
