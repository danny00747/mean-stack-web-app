import mongoose from 'mongoose';
import {success, info, error, debug} from 'consola';

import env from './environment'

const dbURL = `mongodb://${env["DB_HOST"]}/web_app`;

export default function startDatabase() {

    if (env.NODE_ENV === 'test' || env.NODE_ENV === 'dev') {
        mongoose.connect(dbURL,
            {
                useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true,
                useFindAndModify: false
            })
            .then(() => {
                success({
                    message: `Database connected successfully to ${dbURL}`,
                    badge: true
                });
            }).catch(err => {
            error({message: `Mongoose connection error: ${err}`, badge: true});
        });
    } else if (process.env.NODE_ENV === 'production') {
        mongoose.connect(env["MONGODB_URI"],
            {
                useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true,
                useFindAndModify: false
            })
            .then(() => {
                success({
                    message: `Database connected successfully to ${env["MONGODB_URI"]}`,
                    badge: true
                });
            }).catch(err => {
            error({message: `Mongoose connection error: ${err}`, badge: true});
        });

        // If the connection throws an error
        mongoose.connection.on('error', (err) => {
            error({message: `Mongoose connection error: ${err}`, badge: true});
        });

// When the connection is disconnected
        mongoose.connection.on('disconnected', () => {
            error({message: 'Mongoose  connection disconnected', badge: true});
        });

// If the Node process ends, close the Mongoose connection
        process.on('SIGINT', () => {
            mongoose.connection.close(() => {
                error({
                    message: 'Mongoose connection disconnected through app termination',
                    badge: true
                });
                process.exit(0);
            });
        });
    }

}



