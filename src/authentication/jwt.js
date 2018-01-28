const passport = require('passport');
const passportJwt = require('passport-jwt');
const config = require('../config');

import members from '../members';

const LG = console.log;

const jwt = {
  secrets: {},
  db: {},

  init : () => {
    return ( req, res, next ) => {
      jwt.secrets = req.webtaskContext.secrets;
      jwt.db = req.webtaskContext.storage;

      const jwtOptions = {
        jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderWithScheme("jwt"),
        secretOrKey: config.get('authentication.token.secret'),
        issuer: config.get('authentication.token.issuer'),
        audience: config.get('authentication.token.audience')
      };

      if (jwtOptions.audience) {
        passport.use(new passportJwt.Strategy(jwtOptions, (payload, done) => {
          const member = members.getMemberById( 'google', payload.sub, jwt.db, (err, member) => {
            LG('* * * JWT member * * * ');
            LG( member );
            if (member) {
              LG( member );
              return done(null, member);
            }
            return done(null, false);
            LG('\n* * * JWT configured. * * * ');
          });
        }));
      } else {
        LG('\n* * * JWT options have not been defined. * * * ');
      }
      next(null);
    }
  }
};

export default jwt;
