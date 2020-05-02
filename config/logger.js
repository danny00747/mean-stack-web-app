const {createLogger, transports, format} = require('winston');
require('winston-mongodb');
const logger = createLogger({
    transports: [
        new transports.Console({
            level: 'info',
            format: format.combine(format.timestamp(), format.json())
        }),
    ]
});

module.exports = logger;
