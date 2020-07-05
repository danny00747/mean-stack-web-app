const Log = require("../models/logs");
const {success, info, error, debug} = require('consola');


const saveLog = (level, log, type) => {

    (log.hostname === 'devwebapp.herokuapp.com') ?
        new Log({
            level: `${level}`,
            type: `${type}`,
            message: `${type} ${log.method} request to ${log.originalUrl}`,
            url: `${log.originalUrl}`,
            host: `${log.hostname}`,
            method: `${log.method}`,
            date: `${new Date()}`,
            requestId: `${log.id}`,
        }).save().then().catch(err => console.log(err)) : undefined;

};

const updateLog = (level, log, type, status) => {

    (log.hostname === 'devwebapp.herokuapp.com') ?
        new Log({
            level: `${level}`,
            type: `${type}`,
            response: `${type} ${log.method} request to ${log.originalUrl}`,
            status: `${status}`,
            requestId: `${log.id}`,
        }).save().then().catch(err => console.log(err)) : undefined;
};


const getLogs = (req, res) => {
    Log.find()
        .select("-__v")
        .exec()
        .then(logs => {
            //logs.updateLog('info', req, 'Outgoing', 204);
            if (logs.length === 0){
                return res
                    .status(204)
                    .json({message: "No Users found in the database"});
            }
            //logs.updateLog('info', req, 'Outgoing', 200);
            res.status(200).json(logs);
        })
        .catch(err => {
            res
                .status(500)
                .json({
                    errorMessage: err.message,
                    errorName: err.name
                });
           // logs.updateLog('error', req, 'Outgoing', 500);
        });
};

module.exports = {
    saveLog, updateLog, getLogs
};
