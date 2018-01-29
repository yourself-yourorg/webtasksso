'use latest';

import express from 'express';
import { fromExpress } from 'webtask-tools';
import bodyParser from 'body-parser';
import passport from 'passport';
import gapis from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

import token from './token';
import members from './members';
import google from './authentication/google';
import jwt from './authentication/jwt';

const LG = console.log;

function getStaticHost(req) {
    const secrets = req.webtaskContext.secrets;
    return secrets[secrets.STATIC_MODE];
}

// Generate the Token for the member authenticated in the request
function generateUserToken(req, res) {
    const accessToken = token.generateAccessToken(req);
    const static_host = getStaticHost(req);
    res.set('Content-Type', 'text/html');
    res.redirect(302, `${static_host}?tkn=${accessToken}`);
}

const app = express();
app.use(bodyParser.json());

app.use(passport.initialize());

app.use(members.init());

app.use(google.init());

app.use(jwt.init());

const GOOGAUTH = `/authentication/google`;
app.get(`${GOOGAUTH}/start`,
    passport.authenticate(
        'google',
        {
            session: false,
            scope: [
              'profile',
              'email',
              'https://www.googleapis.com/auth/spreadsheets',
              'https://www.googleapis.com/auth/drive',
            ],
            accessType: 'offline',
            approvalPrompt: 'force'
        }
    )
);

app.get(`${GOOGAUTH}/redirect`,
    passport.authenticate('google', { session: false }),
    generateUserToken,
);

// app.get('/testMe', (req, res, next) => {
//     const timeCode = parseInt(req.query.t) * 1000;
//     const date = new Date( timeCode );
//     // LG(`* * Code : ${timeCode} & Date : ${date}`);
//     const hours = date.getHours(); // minutes part from the timestamp
//     const minutes = date.getMinutes(); // seconds part from the timestamp
//     const seconds = date.getSeconds(); // will display time in 10:30:23 format
//     const formattedTime = hours + ':' + minutes + ':' + seconds;
//     res.send(`Got ${timeCode}  & Date : ${date}`);
//     next();
// }, () => {
//     LG('* * * Finished Test : Create Member : ');
// });

app.get('/insecure', (req, res, next) => {
    res.send('Insecure response');
    next();
}, () => {
    LG('* * * Finished sending insecure response\n');
});

app.get('/secure',
    passport.authenticate(['jwt'], { session: false }),
    (req, res) => {

        const secrets = req.webtaskContext.secrets;
        const provider = req.user.providers[0];
        const oauth2Client = new OAuth2Client(
            secrets.GOOGLE_CLIENTID,
            secrets.GOOGLE_CLIENTSECRET,
            secrets.GOOGLE_REDIRECT_URI
        );
        const creds = {
            access_token: provider.tkn,
            refresh_token: provider.rfr
        }
        oauth2Client['credentials'] = creds;

        gapis.drive('v3').files.list({
            auth: oauth2Client,
            pageSize: 10,
            fields: "nextPageToken, files(id, name)"
        }, function(err, response) {
            if (err) {
                LG('The API returned an error: ' + err);
                return;
            }
            if ( response ) {
                const data = response.data;
                if ( data ) {
                    const files = data.files;
                    if ( files ) {
                        if (files.length > 0) {
                            LG('Got these files from your Google Drive:');
                            for (var i = 0; i < files.length; i++) {
                            var file = files[i];
                                LG('%s (%s)', file.name, file.id);
                            }
                        } else {
                            LG('List of files was empty.');
                        }
                    } else {
                      LG(`response data had no files attribute.`);
                      LG( response);
                    }
                } else {
                  LG('Found no data attribute in response.');
                }
            } else {
              LG('Got no response at all.');
            }
        });

        // gapis.sheets('v4').spreadsheets.values.get({
        //     auth: oauth2Client,
        //     spreadsheetId: '1NITk258-perOnxMk4iqeRvLDLMlasuZXNEM1J82kcEk',
        //     range: 'Screwy!A1:B4',
        // }, function(err, response) {
        //     if (err) {
        //       LG('The API returned an error: ' + err);
        //       return;
        //     }
        //     if ( response ) {
        //         LG(' response ');
        //         LG( response );
        //         var rows = response.values;
        //         if ( rows && rows.length > 0) {
        //           LG('A, B');
        //           for (var i = 0; i < rows.length; i++) {
        //             var row = rows[i];
        //             // Print columns A and E, which correspond to indices 0 and 4.
        //             LG('%s, %s', row[0], row[4]);
        //           }
        //         } else {
        //           LG('No data found.');
        //         }
        //     } else {
        //       LG('Got no response at all.');
        //     }
        // });

        res.send('Secure response from ' + JSON.stringify(req.user));
    }
);

app.get('/', (req, res) => {
    const HTML = renderView({
      url: getStaticHost(req),
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
        <meta http-equiv="refresh" content="0; url=${locals.url}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </head>
    <body>
      <p><a href="${locals.url}">Redirect</a></p>
    </body>
    </html>
  `;
}
