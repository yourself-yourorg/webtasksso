import passportJwt from 'passport-jwt';

const LG = console.log;

export default function ( passport, options ) {
  return function(req, res, next) {
    LG( `\nThis is where we get to set up passport.\n` );
    LG( options.audience.doc );

    passport.use(new passportJwt.Strategy(options, (payload, done) => {
      LG( `This is where we get to match users to privileges` );
      // const user = users.getUserById(parseInt(payload.sub));
      // if (user) {
      //     return done(null, user, payload);
      // }
      return done();
    }));

    next();
  }
};
