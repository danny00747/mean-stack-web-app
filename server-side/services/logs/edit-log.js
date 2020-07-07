import {makeLog} from '../../domain'

export default function makeEditLogService({logsRepository}) {
    return async ({reqId, ...logInfo} = {}) => {

        const existing = await logsRepository.findById({reqId});
        
        const log = makeLog({...logInfo});

        return  await logsRepository.patch({
            id: existing._id,
            status: log.getStatus(),
            response: log.getResponse()
        });

    }
}
