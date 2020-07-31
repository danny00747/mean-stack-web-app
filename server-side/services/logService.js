import {makeLog} from '../domain'

export default function logServiceFactory({logsRepository}) {
    return Object.freeze({
        createLog, listLogs
    });

    async function createLog({logInfo} = {}) {
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

    async function listLogs({limit} = {}) {

        if (!limit) throw new Error('You must supply a limit');

        if (!(Number.isInteger(Number(limit))))
            throw new TypeError('The limit must an intger.');

        if (limit <= 0)
            throw new RangeError('The limit must be above zero');

        const total = await logsRepository.findNumberOfLogs();

        if (Number(limit) > total)
            throw new RangeError(`There are ${total} logs available in database !`);

        return [{totalLogs: total}, await logsRepository.findLogs(limit)]
    }
};
