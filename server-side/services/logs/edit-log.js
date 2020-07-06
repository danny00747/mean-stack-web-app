import {makeLog} from '../../domain'

export default function makeEditLogService({logsRepository}) {
    return async ({requestId, ...logInfo} = {}) => {

        const existing = await logsRepository.findById({requestId});
        
        const log = makeLog({...logInfo});

        return  await logsRepository.patch({
            id: existing._id,
            status: log.getStatus(),
            response: log.getResponse()
        });

    }
}
