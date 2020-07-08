import {makeLog} from '../../domain'

export default function makeAddLogService({logsRepository}) {
    return async ({...logInfo} = {}) => {

        const log = makeLog({...logInfo});
        return logsRepository.save({
            requestId: log.getRequestId(),
            host: log.getHost(),
            url: log.getURL(),
            ip: log.getIp(),
            level: log.getLogLevel(),
            status: log.getStatus(),
            method: log.getMethod(),
            response: log.getResponse(),
            message: log.getMessage(),
            date: log.getDate()
        });
    }
}
