const passport = require('passport');
const passportGoogle = require('passport-google-oauth');

import members from '../members';

const LG = console.log;

const google = {
  secrets: {},
  db: {},

  init : () => {
    // LG('\n* * * google init. * * * ');
    return ( req, res, next ) => {
      // LG('Google auth middleware');
      google.secrets = req.webtaskContext.secrets;
      google.db = req.webtaskContext.storage;

      const passportConfig = {
        clientID: google.secrets.GOOGLE_CLIENTID,
        clientSecret: google.secrets.GOOGLE_CLIENTSECRET,
        callbackURL: google.secrets.GOOGLE_REDIRECT_URI
      };

      // LG(req.url);
      if (passportConfig.clientID) {
        // LG(`\n* * * Google configured :: ${passportConfig.callbackURL}`);
        passport.use(
          new passportGoogle.OAuth2Strategy( passportConfig, (accessToken, refreshToken, profile, done) => {

            // LG('* * * Google : Create Member : ');
            // LG( accessToken );
            // LG( refreshToken );
            const spec = {
              name: profile.displayName,
              email: profile.emails[0].value,
              providers: [
                {
                  provider: 'google',
                  id: profile.id,
                  tkn: accessToken,
                  rfr: refreshToken
                }
              ]
            };

            members.createMember(spec, google, ( err, member ) => {
              // LG(`Google strategy got back member :`);
              // LG(member);
              return done(null, member);
            });

          })
        );
      } else {
          LG('\n* * * Google credentials have not been defined. * * * ');
      }

      next(null);
    }
  }

};

export default google;
