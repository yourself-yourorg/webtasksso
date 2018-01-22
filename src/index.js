'use latest';
import express from 'express';
import { fromExpress } from 'webtask-tools';
import bodyParser from 'body-parser';
import passport from 'passport';

const config = require('./config');
const token = require('./token');
require('./authentication/jwt');
require('./authentication/google');
require('./authentication/facebook');

const LG = console.log;

// Generate the Token for the user authenticated in the request
function generateUserToken(req, res) {
    const accessToken = token.generateAccessToken(req.user.id);
    const userId = req.user.id;
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
        `<!DOCTYPE html><html><body>
            <p>User is : ${userId}</p>
            <p>Token is : ${accessToken}</p>
            <script type="text/javascript">
                console.log('Token is : ');
                console.log('${accessToken}');
                window.opener.authenticateCallback('${accessToken}');
                window.close();
            </script>
        </body></html>`
    );
}

const app = express();
app.use(bodyParser.json());

app.use(passport.initialize());

app.get('/authentication/google/start',
    (req, res, next) => { LG('* * * Started google authentication\n%s', req.query.sid.replace(/=/g, '')); next(); },
    passport.authenticate('google', { session: false, scope: ['openid', 'profile', 'email'] })
);
app.get('/authentication/google/redirect',
    passport.authenticate('google', { session: false }),
    generateUserToken
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
