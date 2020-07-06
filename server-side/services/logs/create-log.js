import {makeLog} from '../../domain'
export default function makeAddLogService({logsRepository}) {
    return async ({...logInfo} = {}) => {
        const log = makeLog({...logInfo});
        return logsRepository.save({
            type: log.getType(),
            requestId: log.getRequestId(),
            status: log.getStatus(),
            message: log.getMessage(),
            level: log.getLogLevel(),
            method: log.getMethod(),
            url: log.getURL(),
            host: log.getHost(),
            date : log.getDate()
        })
    }
}
