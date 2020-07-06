"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _users = _interopRequireDefault(require("../models/users"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const JwtStrategy = require('passport-jwt').Strategy;

const ExtractJwt = require('passport-jwt').ExtractJwt;

// to auth the user by JWT Startegy
const authenticateUser = passport => {
  // At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("JWT");
  opts.secretOrKey = process && process.env && process.env.JWT_KEY || "secret"; // The JWT payload is passed into the verify callback

  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    //console.log(jwt_payload);
    // assign the `userId` property on the JWT to the database ID of user
    _users.default.findById(jwt_payload.userId, (err, user) => {
      //console.log(err);
      if (err) return done(err, false); // here, the JWT is valid and the user is valid, so we are authorized!

      if (user) return done(null, user);
      return done(null, false);
    });
  }));
};

var _default = authenticateUser;
exports.default = _default;