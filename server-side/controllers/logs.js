const Log = require("../models/logs");
const {success, info, error, debug} = require('consola');


const saveLog = (level, log) => {

    (log.hostname === 'devwebapp.herokuapp.com') ?
        new Log({
            level: `${level}`,
            message: `Incoming ${log.method} request to ${log.originalUrl}`,
            host: `${log.hostname}`,
            method: `${log.method}`,
            date: `${new Date()}`,
        }).save().then().catch() : undefined;

};

module.exports = {
    saveLog
};
