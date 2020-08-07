export default function makeLogRepository({Logs}) {
    return Object.freeze({
        save, findById, patch, findLogs, findNumberOfLogs
    });

    async function save({...logInfo}) {
        const db = new Logs(logInfo);
        return await db.save();
    }

    async function findById({reqId: requestId}) {
        return await Logs.findOne({requestId})
            .exec();

    }

    async function findLogs(limit) {
        return await Logs.find()
            .sort({date: 1})
            .limit(Number(limit))
            .select("-__v")
            .exec();
    }

    async function findNumberOfLogs() {
        return Logs.estimatedDocumentCount({});
    }




    async function patch({id: _id, ...logInfo}) {
        return await Logs.findByIdAndUpdate({_id}, {...logInfo}, {new: true}).exec();
    }

}

