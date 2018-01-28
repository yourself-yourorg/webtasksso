'use latest';

import express from 'express';
import { fromExpress } from 'webtask-tools';
import bodyParser from 'body-parser';
import passport from 'passport';
import async from 'async';

import members from './members';
import google from './authentication/google';
import jwt from './authentication/jwt';

const config = require('./config');
const token = require('./token');
// require('./authentication/jwt');
require('./authentication/facebook');

const LG = console.log;
global.test = 'abc';

// Generate the Token for the member authenticated in the request
function generateUserToken(req, res) {
    const accessToken = token.generateAccessToken(req.user.id);
    const memberId = `${req.user.id} / ${req.user.name}`;
    const HTML = renderView({
      title: 'My Webtask View',
      body: '<h1>Simple WebTask view</h1>'
    });

    console.log( 'request.user' );
    console.log( req.user );
    console.log( req.user.id );
    console.log( 'request.url' );
    console.log( req.url );
    console.log( `${req.protocol}://$(req.hostname)/${req.path}` );

    res.set('Content-Type', 'text/html');
    res.redirect(302, `http://localhost:8888/?tkn=${accessToken}`);

}

const app = express();
app.use(bodyParser.json());

app.use(passport.initialize());

app.use(members.init());

app.use(google.init());

app.use(jwt.init());

const GOOGAUTH = `/authentication/google`;
app.get(`${GOOGAUTH}/start`,
    (req, res, next) => { LG('* * * Started google authentication\n%s', req.query); next(); },
    passport.authenticate('google', { session: false, scope: ['openid', 'profile', 'email'] })
);

app.get(`${GOOGAUTH}/redirect`,
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
    const timeCode = parseInt(req.query.t) * 1000;
    const date = new Date( timeCode );
    LG(`* * Code : ${timeCode} & Date : ${date}`);
    const hours = date.getHours(); // minutes part from the timestamp
    const minutes = date.getMinutes(); // seconds part from the timestamp
    const seconds = date.getSeconds(); // will display time in 10:30:23 format
    const formattedTime = hours + ':' + minutes + ':' + seconds;
    res.send(`Got ${timeCode}  & Date : ${date}`);
    next();
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
