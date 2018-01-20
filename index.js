'use latest';

import express from 'express';
import { fromExpress } from 'webtask-tools';
import bodyParser from 'body-parser';
import passport from 'passport';
import passportJwt from 'passport-jwt';
import async from 'async';

const LG = console.log;

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
  // The secret that was used to sign the JWT
//  secretOrKey: config.get('authentication.token.secret'),
  secretOrKey: null,
  // The issuer stored in the JWT
//  issuer: config.get('authentication.token.issuer'),
  issuer: 'issuer?',
  // The audience stored in the JWT
//  audience: config.get('authentication.token.audience')
  audience: null,
  
  init : () => {
    return ( req, res, next ) => {
      req.webtaskContext.storage.get( ( error, _data ) => {
        let data = _data;
        if ( error ) throw error;
        if ( ! data ) throw new Error('No storage has been defined.');
        const token = data.authentication.token
        jwtOptions.secretOrKey = token.secret;
        jwtOptions.issuer = token.issuer;
        jwtOptions.audience = token.audience;
        next(null);
      } );
    }
  }
};

const users = {
  list: [{ id: 0, name: 'Graham', providers: [] }],

  createUser: (name, provider, id) => {
    const user = {
        id: list.length,
        name: name,
        providers: [
            {
                provider: provider,
                id: id
            }
        ]
    };
    list.push(user);
    return user;
  },

  getUserByExternalId: (provider, id) => list.find((u) =>
        u.providers.findIndex((p) => p.provider == provider && p.id == id) >= 0),

  getUserById: (id) => list.find((u) => u.id == id),
};

const app = express();

app.use(bodyParser.json());

app.use(passport.initialize());

app.use(jwtOptions.init());

app.get('/insecure', (req, res) => {
    res.send('Insecure response');
});

app.get('/secure', (req, res) => {
    res.send('Secure response');
});

const msg = ' test ';
let clid = ' not set  ';
let config = ' none ';
app.get('/', (req, res) => {
  const context = req.webtaskContext;
  const db = context.storage;
  async.waterfall([
      step => {
        LG('Starting ....');
        step(null, 'dummy!!');
      },
      // step => {
      //   LG('prep Jwt Options ....');
      //   getJwtOptions( jwtOptions, db, step);
      // },
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
