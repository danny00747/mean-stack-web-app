export default function makeQuestionRepository({Question}) {
    return Object.freeze({
        save, findAll, findById, patch, remove
    });

    async function save({...questionInfo}) {
        const question = new Question(questionInfo);
        return await question.save();
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
        return await Question.findByIdAndUpdate({_id}, {...questionInfo}, {new: true}).exec();
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
