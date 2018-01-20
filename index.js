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

let jwtOptions = {
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
  audience: null
};

const getJwtOptions = ( opt, db, step ) => {
  db.get( ( error, _data ) => {
    let data = _data;
    if ( error ) throw error;
    if ( ! data ) throw new Error('No storage has been defined.');
    const token = data.authentication.token
    opt.secretOrKey = token.secret;
    opt.issuer = token.issuer;
    opt.audience = token.audience;
    LG( '  opt : %s', Object.keys(opt));
    step(null, opt);
  } );
};

const app = express();

app.use(bodyParser.json());

app.use(passport.initialize());

const msg = ' test ';
let clid = ' not set  ';
let config = ' none ';
app.get('/', (req, res) => {
  const context = req.webtaskContext;
  const db = context.storage;
  async.waterfall([
      step => {
        LG('Starting ....');
        step(null);
      },
      step => {
        getJwtOptions( jwtOptions, db, step);
      }
  ], function (err, rslt) {
    jwtOptions = rslt
    LG( 'result', jwtOptions.issuer);
    // let result = message + rslt + `.`
    // cb(null, { result });
    
    // if ( context.secrets[Auth0.__settings.conf] ) config = JSON.parse(context.secrets[Auth0.__settings.conf]);
    if ( context.secrets[Auth0.__settings.conf] ) config = JSON.parse(context.secrets[Auth0.__settings.conf]);
    const HTML = renderView({
      title: 'My Webtask View',
      body: '<h1>Simple WebTask ' + msg + ' view</h1><div>Id: &nbsp; - ' + jwtOptions.audience.doc + '</div>'
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
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.99.0/css/materialize.min.css"  media="screen,projection"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </head>
    <body>
    	<nav>
    		<div class="nav-wrapper">
    			<a href="#" class="brand-logo">Social Logins for Single Page Applications</a>
    		</div>
    	</nav>
        <div class="row">
            <div class="col s12">
                <div class="section">
                    <p class="caption">
                        This project acts as an example on how to implement Social Logins for Single Page Applications by means of Passport.js.<br />
                    </p>
                    <p>
                        Below there are two buttons to make API requests:<br />
                        <ul class="browser-default">
                            <li class="collection-item">
                                <div>
                                    Insecure Request - This makes a request that will always work regardless of whether you are authenticated
                                </div>
                            </li>
                            <li class="collection-item">
                                <div>
                                    Secure Request - This makes a request that will only work if you are authenticated
                                </div>
                            </li>
                        </ul>
                    </p>
                    <p>
                        There are also two buttons that can be used to authenticate, one for Google+ and one for Facebook.
                    </p>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="row">
                <div class="input-field col s12">
                    <label class="active" for="status">Response Status</label>
                    <input id="status" type="text" readonly value="  " />
                </div>
            </div>
            <div class="row">
                <div class="input-field col s12">
                    <label class="active" for="output">Output from Request:</label>
                    <input id="output" type="text" readonly value="  " />
                </div>
            </div>
            <div class="row">
                <div class="input-field col s12">
                    <label class="active" for="output">Access Token:</label>
                    <input id="accessToken" type="text" readonly value="  " />
                </div>
            </div>
            <div class="row">
                <div class="input-field col s12">
                    <button class="btn waves-effect waves-light" id="insecure">Insecure Request</button>
                    <button class="btn waves-effect waves-light" id="secure">Secure Request</button>
                </div>
            </div>
            <div class="row">
                <div class="input-field col s12">
                    <button class="btn waves-effect waves-light" id="google">Authenticate with Google+</button>
                    <button class="btn waves-effect waves-light" id="facebook">Authenticate with Facebook</button>
                </div>
            </div>
        </div>
        <script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.99.0/js/materialize.min.js"></script>
        <script type="text/javascript">
            let accessToken;

            function makeRequest(url) {
                const headers = {};
                if (accessToken) {
                    headers['Authorization'] = 'JWT ' + accessToken;
                }

                fetch(url, { headers: headers })
                    .then((response) => {
                        $('#status').val(response.statusText);
                        response.text()
                            .then((text) => {
                                $('#output').val(text);
                            });

                    });
            }

            function authenticate(provider) {
                window.authenticateCallback = function(token) {
                    accessToken = token;
                    $('#accessToken').val(accessToken);
                };

                window.open('/api/authentication/' + provider + '/start');
            }

            document.getElementById('insecure').onclick = () => makeRequest('/api/insecure');
            document.getElementById('secure').onclick = () => makeRequest('/api/secure');
            document.getElementById('google').onclick = () => authenticate('google');
            document.getElementById('facebook').onclick = () => authenticate('facebook');
        </script>

    </body>
    </html>
  `;
}
