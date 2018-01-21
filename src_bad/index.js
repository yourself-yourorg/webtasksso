'use latest';

import express from 'express';
import { fromExpress } from 'webtask-tools';
import bodyParser from 'body-parser';
import passport from 'passport';
import passportJwt from 'passport-jwt';
import async from 'async';

import users from './users';
import jwtOptions from './jwtoptions';
import jwtStrategy from './jwtStrategy';

const LG = console.log;

const Auth0 = {
  __settings: {
    conf: 'CONFIG',
    client_id_key: 'GOOGLE_CLIENTID',
    client_secret_key: 'GOOGLE_CLIENTSECRET'
  },
}

const app = express();

app.use(bodyParser.json());

app.use(passport.initialize());

app.use(jwtOptions.init( passportJwt ));

app.use(users.init(jwtOptions));

app.use(jwtStrategy(passport, jwtOptions ));

app.get('/authentication/google/start', (req, res) => {
    res.send('authentication/google/start response');
});

app.get('/insecure', (req, res) => {
    res.send('Insecure response');
});

app.get('/secure', (req, res) => {
  // passport.use(new passportJwt.Strategy(jwtOptions, (payload, done) => {
  //   LG( `This is where we get to match users to privileges` );
  //   // const user = users.getUserById(parseInt(payload.sub));
  //   // if (user) {
  //   //     return done(null, user, payload);
  //   // }
  //   return done();
  // }));
  res.send('Secure response, with ' + jwtOptions.audience.doc);
});

const msg = ' test ';
let clid = ' not set  ';
let config = ' none ';
app.get('/', (req, res) => {
  const context = req.webtaskContext;
  const db = context.storage;
  async.waterfall([
      step => {
        LG('Starting with user ....%s', users.list[0].phone);
        step(null, 'dummy!!');
      },
      ( dummy, step ) => {
        LG('Use passport ....%s', dummy);
        LG( jwtOptions.audience.default );
        // passport.use(new passportJwt.Strategy(jwtOptions, (payload, done) => {
        //   LG( `This is where we get to match users to privileges` );
        //   // const user = users.getUserById(parseInt(payload.sub));
        //   // if (user) {
        //   //     return done(null, user, payload);
        //   // }
        //   return done();
        // }));
        step(null, 'Passport should be initialized now.');
      }
  ], function (err, rslt) {

    LG( 'result', rslt);
    if ( context.secrets[Auth0.__settings.conf] ) config = JSON.parse(context.secrets[Auth0.__settings.conf]);
    const HTML = renderView({
      title: 'My Webtask View',
      body: '<h1>Simple WebTask ' + msg + ' view</h1><div>Id: &nbsp; - ' + rslt + '</div>'
    });

    res.set('Content-Type', 'text/html');
    res.status(200).send(HTML);
  });

});

module.exports = fromExpress(app);

function renderView(locals) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Social Logins for Single Page Applications</title>
        <meta http-equiv="refresh" content="5; url=https://yourself-yourorg.github.io/webtasksso/" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </head>
    <body>
      <p><a href="https://yourself-yourorg.github.io/webtasksso">Redirect</a></p>
    </body>
    </html>
  `;
}
