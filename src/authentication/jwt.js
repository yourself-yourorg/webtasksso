const passport = require('passport');
const passportJwt = require('passport-jwt');
const config = require('../config');
const members = require('../members');

const jwtOptions = {
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderWithScheme("jwt"),
    secretOrKey: config.get('authentication.token.secret'),
    issuer: config.get('authentication.token.issuer'),
    audience: config.get('authentication.token.audience')
};

passport.use(new passportJwt.Strategy(jwtOptions, (payload, done) => {
    const member = members.getMemberById(parseInt(payload.sub));
    if (member) {
        return done(null, member, payload);
    }
    return done();
}));
