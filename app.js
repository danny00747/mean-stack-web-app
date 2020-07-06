import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import passport from 'passport'
import authenticateUser from './server-side/security/passport';
import routes from './server-side/routes'
const addRequestId = require('express-request-id')();
import path from 'path';
const {success, info, error, debug} = require('consola');
import helmet from 'helmet';
require('dotenv').config();
require('./server-side/config/database');

// Initialize the app
const app = express();

// Defining the Middlewares
app.use(cors());
app.use(helmet());
app.use(addRequestId);

// security headers 
app.use(helmet.hsts({
    maxAge: 5184000,
    includeSubDomains: true
}));

// security headers 
app.use(helmet.featurePolicy({
    features: {
        fullscreen: ["'self'"],
        vibrate: ["'none'"],
        payment: ["'none'"],
        syncXhr: ["'none'"],
        camera: ["'none'"],
        microphone: ["'none'"],
    }
}));

// security headers 
app.use(helmet.permittedCrossDomainPolicies());

// security headers 
app.use(helmet.referrerPolicy({policy: 'strict-origin-when-cross-origin'}));


// set the static folder
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path
        .join(__dirname, 'server-side', 'public', 'dist')));
}


// BodyParser Midlleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// bring the passport auth strategy
authenticateUser(passport);

app.get('/', (req, res) => {
    return res.sendFile(path
        .join(__dirname + '/server-side', 'public', 'dist', 'index.html'));
});

// Bring in the user routers
//const reviews = require('./server-side/routes/reviews');
//const users = require('./server-side/routes/users');
//const questions = require('./server-side/routes/questions');
const logs = require('./server-side/routes/logs');

app.use('/server/api/', routes.usersRoutes);
app.use('/server/api/', routes.questionsRoutes);
app.use('/server/api/', routes.reviewsRoutes);
app.use('/server/api/', logs);

app.use('/server/api/api-documentation', (req, res) => {
    return res.sendFile(path
        .join(__dirname + '/docs', 'index.html'));
});

app.get('*', (req, res) => {
    return res.sendFile(path
        .join(__dirname + '/server-side', 'public', 'dist', 'index.html'));
});

app.listen(process.env.PORT, () => {
    info({message: `Server started on port ${process.env["PORT"]}`, badge: true});
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const error = new URIError("Page Not found !");
    error.status = 404;
    next(error.message);
});

// Error Handler
app.use((error, req, res) => {
    //console.log(res.locals.error);
    res.status(error.status || 500);
    res.json({
        message: error.message
    });
});

module.exports = app;
