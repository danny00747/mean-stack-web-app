export default function makeLogRepository({Logs}) {
    return Object.freeze({
        save, findById, patch, findAll, findMax
    });

    async function save({...logInfo}) {
        const db = new Logs(logInfo);
        return await db.save();
    }

    async function findById({reqId: requestId}) {
        return await Logs.findOne({requestId})
            .exec();

    }

    async function findAll(max) {
        return await Logs.find()
            .sort({date: -1})
            .limit(Number(max))
            .select("-__v")
            .exec();
    }

    async function findMax() {
        return Logs.estimatedDocumentCount({});
    }




    async function patch({id: _id, ...logInfo}) {
        return await Logs.findByIdAndUpdate({_id}, {...logInfo}, {new: true}).exec();
    }

}

