const passport = require('passport');
const passportGoogle = require('passport-google-oauth');
const config = require('../config');

import members from '../members';

const LG = console.log;

const google = {
  secrets: {},
  db: {},

  init : () => {
    return ( req, res, next ) => {

      LG('Google auth middleware');
      google.secrets = req.webtaskContext.secrets;
      google.db = req.webtaskContext.storage;

      const passportConfig = {
        clientID: config.get('authentication.google.clientId'),
        clientSecret: config.get('authentication.google.clientSecret'),
        callbackURL: config.get('http.svc_url') + '/authentication/google/redirect'
      };

      if (passportConfig.clientID) {
        LG('\n* * * Google configured. * * * ');
        passport.use(
          new passportGoogle.OAuth2Strategy( passportConfig, (accessToken, refreshToken, profile, done) => {
            LG('* * * Process member. * * * ');
            LG( google.secrets.GOOGLE_CLIENTID );
            LG('* accessToken * ');
            LG( accessToken );
            LG('* refreshToken * ');
            LG( refreshToken );
            LG('* profile * ');
            LG( profile );

            LG('* * * Google : Create Member : ');
            members.createMember(
                profile.displayName,
                'google',
                profile.id,
                profile.emails[0].value,
                google.db,
                ( err, member ) => {
                  LG(`Google strategy got back member :`);
                  LG(member);
                  return done(null, member);
                }
                // ( member ) => {
                //     LG(`whoopie %s`, member);
                //     res.send(
                //         member ?
                //         `Search returned member : '${member.providers[0].provider}/${member.providers[0].id}'.` :
                //         `Search returned : None.`
                //     );
                // }
            );

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
