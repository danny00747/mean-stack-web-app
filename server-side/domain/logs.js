export default function buildMakeLog(requiredParameter) {
    return ({
                host = requiredParameter('A host'),
                method = requiredParameter('A method'),
                message = requiredParameter('A message'),
                url = requiredParameter('The URL'),
                status = -1,
                level = requiredParameter('The level'),
                type = requiredParameter('A type'),
                requestId = "",
                response = "",
                date = new Date(),
            } = {}) => {

        if (typeof host !== 'string') throw new TypeError('A host must be a string.');
        if (typeof method !== 'string') throw new TypeError('A method must be a string.');
        if (typeof message !== 'string') throw new TypeError('A message must be a string.');
        if (typeof url !== 'string') throw new TypeError('The URL must be a string.');
        if (typeof level !== 'string') throw new TypeError('The level must be a string.');
        if (typeof type !== 'string') throw new TypeError('A type must be a string.');
        if (typeof requestId !== 'string') throw new TypeError('The id must be a string.');

        const logLevelEnum = {
            DEBUG: "debug", INFO: "info", WARN: "warn", ERROR: "error"
        };
        Object.freeze(logLevelEnum);

        return Object.freeze({
            getRequestId: () => requestId,
            getHost: () => host,
            getType: () => type,
            getStatus: () => status,
            getMethod: () => method,
            getMessage: () => message,
            getDate: () => date,
            getResponse: () => response,
            getLogLevel: () => logLevel(level),
            getURL: () => url
        });

        function logLevel(level) {
            if (level === "debug") {
                return logLevelEnum.DEBUG
            } else if (level === "info") {
                return logLevelEnum.INFO
            } else if (level === "warn") {
                return logLevelEnum.WARN
            } else if (level === "info") {
                return logLevelEnum.INFO
            } else if (level === "error") {
                return logLevelEnum.ERROR
            }
        }
    }
}
