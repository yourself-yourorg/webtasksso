const LG = console.log;

const options = {
  // Get the JWT from the "Authorization" header.
  // By default this looks for a "JWT " prefix
  // jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  jwtFromRequest: null,
  // The secret that was used to sign the JWT
//  secretOrKey: config.get('authentication.token.secret'),
  secretOrKey: null,
  // The issuer stored in the JWT
//  issuer: config.get('authentication.token.issuer'),
  issuer: 'issuer?',
  // The audience stored in the JWT
//  audience: config.get('authentication.token.audience')
  audience: null,

  init : ( passportJwt ) => {
    return ( req, res, next ) => {
      req.webtaskContext.storage.get( ( error, _data ) => {
        let data = _data;
        if ( error ) throw error;
        if ( ! data ) throw new Error('No storage has been defined.');
        const token = data.authentication.token;
        options.jwtFromRequest = passportJwt.ExtractJwt.fromAuthHeaderWithScheme("jwt");
        options.secretOrKey = token.secret;
        options.issuer = token.issuer;
        options.audience = token.audience;

        next(null);
      } );
    }
  }
};

export default options;
