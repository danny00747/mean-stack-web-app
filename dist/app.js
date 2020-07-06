"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _passport = _interopRequireDefault(require("passport"));

var _passport2 = _interopRequireDefault(require("./security/passport"));

var _routes = _interopRequireDefault(require("./routes"));

var _path = _interopRequireDefault(require("path"));

var _helmet = _interopRequireDefault(require("helmet"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const addRequestId = require('express-request-id')();

const {
  success,
  info,
  error,
  debug
} = require('consola');

require('dotenv').config();

require('./config/database'); // Initialize the app


const app = (0, _express.default)(); // Defining the Middlewares

app.use((0, _cors.default)());
app.use((0, _helmet.default)());
app.use(addRequestId); // security headers 

app.use(_helmet.default.hsts({
  maxAge: 5184000,
  includeSubDomains: true
})); // security headers 

app.use(_helmet.default.featurePolicy({
  features: {
    fullscreen: ["'self'"],
    vibrate: ["'none'"],
    payment: ["'none'"],
    syncXhr: ["'none'"],
    camera: ["'none'"],
    microphone: ["'none'"]
  }
})); // security headers 

app.use(_helmet.default.permittedCrossDomainPolicies()); // security headers 

app.use(_helmet.default.referrerPolicy({
  policy: 'strict-origin-when-cross-origin'
})); // set the static folder

if ((process && process.env && process.env.NODE_ENV || "production") === 'production') {
  app.use(_express.default.static(_path.default.join('/public', 'dist')));
} // BodyParser Midlleware


app.use(_bodyParser.default.json()); // Passport Middleware

app.use(_passport.default.initialize());
app.use(_passport.default.session()); // bring the passport auth strategy

(0, _passport2.default)(_passport.default);
app.get('/', (req, res) => {
  return res.sendFile(_path.default.join(__dirname + 'public', 'dist', 'index.html'));
}); // Bring in the user routers
//const reviews = require('./server-side/routes/reviews');
//const users = require('./server-side/routes/users');
//const questions = require('./server-side/routes/questions');

const logs = require('./routes/logs');

app.use('/server/api/', _routes.default.usersRoutes);
app.use('/server/api/', _routes.default.questionsRoutes);
app.use('/server/api/', _routes.default.reviewsRoutes);
app.use('/server/api/', logs);
app.use('/server/api/api-documentation', (req, res) => {
  return res.sendFile(_path.default.join(__dirname + '/docs', 'index.html'));
});
app.get('*', (req, res) => {
  return res.sendFile(_path.default.join(__dirname + '/public', 'dist', 'index.html'));
});
app.listen(process && process.env && process.env.PORT || "5000", () => {
  info({
    message: `Server started on port ${process && process.env && process.env.PORT || "5000"}`,
    badge: true
  });
}); // catch 404 and forward to error handler

app.use((req, res, next) => {
  const error = new URIError("Page Not found !");
  error.status = 404;
  next(error.message);
}); // Error Handler

app.use((error, req, res) => {
  //console.log(res.locals.error);
  res.status(error.status || 500);
  res.json({
    message: error.message
  });
});
module.exports = app;