export default function makeLogRepository({Logs}) {
    return Object.freeze({
        save, findById, patch
    });

    async function save({...logInfo}) {
        const db = new Logs(logInfo);
        return await db.save();
    }

    async function findById({reqId: requestId}) {
        console.log({requestId});
        return await Logs.findOne({requestId})
            .exec();

    }

    async function patch({id: _id, ...logInfo}) {
        return await Logs.findByIdAndUpdate({_id}, {...logInfo}, {new: true}).exec();
    }

}

