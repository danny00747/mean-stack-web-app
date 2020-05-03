const Log = require("../models/logs");
const {success, info, error, debug} = require('consola');


const saveLog = (level, log, type) => {

    (log.hostname === 'localhost') ?
        new Log({
            level: `${level}`,
            message: `${type} ${log.method} request to ${log.originalUrl}`,
            url: `${log.originalUrl}`,
            host: `${log.hostname}`,
            method: `${log.method}`,
            date: `${new Date()}`,
            requestId: `${log.id}`,
        }).save().then().catch(err => console.log(err)) : undefined;

};

const updateLog = (level, log, type, res) => {

    const logs = {
        level: `${level}`,
        response: `${type} ${log.method} request to ${log.originalUrl}`,
        status: `${res.statusCode}`,
    };

    Log.updateOne({requestId: (log.id).toString()}, {$set: logs})
        .exec()
        .then()
        .catch();
};

module.exports = {
    saveLog, updateLog
};
