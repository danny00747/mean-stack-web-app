const Question = require("./questionModel");
import mongoose from 'mongoose'

export default function makeQuestionDb({Question}) {
    return Object.freeze({
        save, findAll, findById, patch, remove
    });

    async function save({...commentInfo}) {
        const db = new Question(commentInfo);
        return await db.save();
    }

    async function findAll() {
        return await Question.find()
            .select("question answers _id type")
            .exec();
    }

    async function findById({id: _id}) {
        return await Question.findById({_id})
            .select("question answers _id")
            .exec();

    }

    async function patch({id: _id, ...questionInfo}) {
        return await Question.updateOne({_id}, {$set: {...questionInfo}}).exec();
    }

    async function remove ({ id: _id }) {
        return await Question.findByIdAndRemove({ _id }).exec();
    }
}


/**
 *
 * (mongoose.Types.ObjectId.isValid(_id)) {
   throw new Error(`${_id} is not a valid ObjectId`);
 */
