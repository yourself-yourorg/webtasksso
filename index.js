'use latest';

import express from 'express';
import { fromExpress } from 'webtask-tools';
import bodyParser from 'body-parser';
import passport from 'passport';
import passportJwt from 'passport-jwt';

const Auth0 = {
  __settings: {
    conf: 'CONFIG',
    client_id_key: 'GOOGLE_CLIENTID',
    client_secret_key: 'GOOGLE_CLIENTSECRET'
  },
}

const jwtOptions = {
  // Get the JWT from the "Authorization" header.
  // By default this looks for a "JWT " prefix
  jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  // jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeader(),
  // // The secret that was used to sign the JWT
  // secretOrKey: config.get('authentication.token.secret'),
  // // The issuer stored in the JWT
  // issuer: config.get('authentication.token.issuer'),
  // // The audience stored in the JWT
  // audience: config.get('authentication.token.audience')
};

const app = express();

app.use(bodyParser.json());

app.use(passport.initialize());

const msg = ' test ';
let clid = ' not set  ';
let config = ' none ';
app.get('/', (req, res) => {

  var context = req.webtaskContext;
  // if ( context.secrets[Auth0.__settings.conf] ) config = JSON.parse(context.secrets[Auth0.__settings.conf]);
  if ( context.secrets[Auth0.__settings.conf] ) config = JSON.parse(context.secrets[Auth0.__settings.conf]);
  const HTML = renderView({
    title: 'My Webtask View',
    body: '<h1>Simple webtask ' + msg + ' view</h1><div>Id: &nbsp; - ' + config.authentication.token.issuer.doc + '</div>'
  });

  res.set('Content-Type', 'text/html');
  res.status(200).send(HTML);
});

module.exports = fromExpress(app);

function renderView(locals) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${locals.title}</title>
    </head>

    <body>
      ${locals.body}
    </body>
    </html>
  `;
}
