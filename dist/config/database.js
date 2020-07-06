"use strict";

const mongoose = require('mongoose');

const {
  success,
  info,
  error,
  debug
} = require('consola');

const host = process && process.env && process.env.DB_HOST || "localhost:27017";
const hostCloud = process && process.env && process.env.MONGODB_URI || "mongodb+srv://danny:DsedsACzFd3Fu3Q@cluster0-mdf7l.mongodb.net/test?retryWrites=true&w=majority";
const dbURL = `mongodb://${host}/web_app`; //connect with the database

if ((process && process.env && process.env.NODE_ENV || "production") === 'test') {
  mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }).then(() => {
    success({
      message: `Database connected successfully to ${dbURL}`,
      badge: true
    });
  }).catch(err => {
    error({
      message: `Mongoose connection error: ${err}`,
      badge: true
    });
  });
} else if ((process && process.env && process.env.NODE_ENV || "production") === 'production') {
  mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }).then(() => {
    success({
      message: `Database connected successfully to ${dbURL}`,
      badge: true
    });
  }).catch(err => {
    error({
      message: `Mongoose connection error: ${err}`,
      badge: true
    });
  }); // If the connection throws an error

  mongoose.connection.on('error', err => {
    error({
      message: `Mongoose connection error: ${err}`,
      badge: true
    });
  }); // When the connection is disconnected

  mongoose.connection.on('disconnected', () => {
    error({
      message: 'Mongoose  connection disconnected',
      badge: true
    });
  }); // If the Node process ends, close the Mongoose connection

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