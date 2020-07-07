export default function buildMakeLog(requiredParameter) {
    return ({
                host = requiredParameter('A host'),
                method = requiredParameter('A method'),
                url = requiredParameter('The URL'),
                level = requiredParameter('The level'), message = "",
                status = -1, ip = "", requestId = "", response = "", date = new Date(),
            } = {}) => {

        if (typeof host !== 'string') throw new TypeError('A host must be a string.');
        if (typeof method !== 'string') throw new TypeError('A method must be a string.');
        if (typeof url !== 'string') throw new TypeError('The URL must be a string.');
        if (typeof message !== 'string') throw new TypeError('The message must be a string.');
        if (typeof level !== 'string') throw new TypeError('The level must be a string.');
        if (typeof requestId !== 'string') throw new TypeError('The id must be a string.');

        const logLevelEnum = {
            DEBUG: "debug", INFO: "info", WARN: "warn", ERROR: "error"
        };
        Object.freeze(logLevelEnum);

        return Object.freeze({
            getRequestId: () => requestId,
            getHost: () => host,
            getStatus: () => status,
            getMessage: () => message,
            getMethod: () => method,
            getDate: () => date,
            getIp: () => ip,
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
