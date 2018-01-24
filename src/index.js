'use latest';

import express from 'express';
import { fromExpress } from 'webtask-tools';
import bodyParser from 'body-parser';
import passport from 'passport';
import async from 'async';

import members from './members';
import google from './authentication/google';

const config = require('./config');
const token = require('./token');
require('./authentication/jwt');
require('./authentication/facebook');

const LG = console.log;
global.test = 'abc';

// Generate the Token for the member authenticated in the request
function generateUserToken(req, res) {
    const accessToken = token.generateAccessToken(req.user.id);
    const memberId = req.user.id;
    const HTML = renderView({
      title: 'My Webtask View',
      body: '<h1>Simple WebTask view</h1>'
    });

    console.log( 'request.user' );
    console.log( req.user );
    console.log( req.user.id );

    res.set('Content-Type', 'text/html');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.status(200).send(
        `<!DOCTYPE html><html>
        <head>
          <title>Social Logins for Single Page Applications</title>
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
          <link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.99.0/css/materialize.min.css"  media="screen,projection"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body>
            <p>User is : ${memberId}</p>
            <p>Token is : ${accessToken}</p>
            <div class="row">
                <div class="row">
                  <div class="input-field col s4">
                    <button class="btn waves-effect waves-light" id="secure">Secure Request</button>
                  </div>
                  <div class="input-field col s4">
                    <label class="active" for="status">Response Status</label>
                    <input id="status" type="text" readonly value="  " />
                  </div>
                  <div class="input-field col s4">
                    <label class="active" for="output">Output from Request:</label>
                    <input id="output" type="text" readonly value="  " />
                  </div>
                </div>
            </div>
            <script type="text/javascript">
                const accessToken = '${accessToken}';
                const secureService = "https://wt-a0a68818c7b34a465e865e888dc419c9-0.run.webtask.io/webtasksso";
                console.log('Token is : ');
                console.log('${accessToken}');

                function makeRequest(url) {
                  const headers = {};
                  if (accessToken) {
                    headers['Authorization'] = 'JWT ' + accessToken;
                  }
                  console.log('  Headers ...  ');
                  console.log( headers);

                  fetch(url, { headers: headers })
                    .then((response) => {
                      document.getElementById('status').value = response.statusText;
                      response.text()
                        .then((text) => {
                          document.getElementById('output').value = response.text;
                        });
                    });
                }

                document.getElementById('secure').onclick = () => makeRequest(secureService + '/secure');

            </script>
        </body></html>`
    );
}

const app = express();
app.use(bodyParser.json());

app.use(passport.initialize());

app.use(members.init());

app.use(google.init());

app.get('/authentication/google/start',
    (req, res, next) => { LG('* * * Started google authentication\n%s', req.query.sid.replace(/=/g, '')); next(); },
    passport.authenticate('google', { session: false, scope: ['openid', 'profile', 'email'] })
);

app.get('/authentication/google/redirect',
    (req, res, next) => {
        LG('* * * Started google redirect :');
        next();
    },
    passport.authenticate('google', { session: false }),
    (req, res, next) => {
        LG('* * * Generating token :');
        next();
    },
    generateUserToken,
    (req, res, next) => {
        LG('* * * Generatied token :');
        next();
    }
);

// app.get('/authentication/facebook/start',
//     passport.authenticate('facebook', { session: false }));
// app.get('/authentication/facebook/redirect',
//     passport.authenticate('facebook', { session: false }),
//     generateUserToken);

let sid;
app.get('/getsid', (req, res, next) => {
    sid = (req.query.sid || '* =null= *').replace(/=/g, '');
    res.send(`From server "Get the data record for : ` + sid + '"');
    next();
}, () => {
    LG('* * * Finished getting sid : %s\n', sid);
});

app.get('/testMe', (req, res, next) => {
    const mid = req.query.id;
    const db = req.webtaskContext.storage;

    const demo = {
        id: null,
        email: 'a@b.c',
        name: 'Sigut',
        providers: [{ provider: 'google', id: mid }]
    }

    LG('* * * Test : Create Member : ');
    members.createMember(
        demo.name,
        demo.providers[0].provider,
        demo.providers[0].id,
        demo.email,
        db,
        ( member ) => {
            LG(`whoopie %s`, member);
            res.send(
                member ?
                `Search returned member : '${member.providers[0].provider}/${member.providers[0].id}'.` :
                `Search returned : None.`
            );
            next();
        }
    );
    return;
}, () => {
    LG('* * * Finished Test : Create Member : ');
});

app.get('/insecure', (req, res, next) => {
    res.send('Insecure response');
    next();
}, () => {
    LG('* * * Finished sending insecure response\n');
});

app.get('/secure',
    (req, res, next) => { LG('* * * Started secure response\n'); next(); },
    passport.authenticate(['jwt'], { session: false }),
    (req, res) => {
        res.send('Secure response from ' + JSON.stringify(req.user));
    });

app.get('/', (req, res) => {
    const HTML = renderView({
      title: 'My Webtask View',
      body: '<h1>Simple WebTask view</h1>'
    });

    res.set('Content-Type', 'text/html');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.status(200).send( HTML );
});
module.exports = fromExpress(app);

function renderView(locals) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Social Logins for Single Page Applications</title>
        <meta http-equiv="refresh" content="0; url=https://yourself-yourorg.github.io/webtasksso/" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </head>
    <body>
      <p><a href="https://yourself-yourorg.github.io/webtasksso">Redirect</a></p>
    </body>
    </html>
  `;
}
