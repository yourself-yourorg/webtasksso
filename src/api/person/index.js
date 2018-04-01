import { Client as Backend} from 'node-rest-client';
import utils from '../../utils';
// import Ipsum from 'bavaria-ipsum';

// const ipsum = new Ipsum();

const LG = console.log;
const MODULE = 'person';

// const articles = [
//   {
//     id: 1,
//     title: ipsum.generateSentence(),
//     content: ipsum.generateParagraph()
//   },
//   {
//     id: 2,
//     title: ipsum.generateSentence(),
//     content: ipsum.generateParagraph()
//   },
//   {
//     id: 3,
//     title: ipsum.generateSentence(),
//     content: ipsum.generateParagraph()
//   }
// ];

// const doCreate = (req, res, next) => {
//   const id = articles[articles.length - 1].id + 1;
//   const { body } = req;

//   const article = {
//     id,
//     title: body.title,
//     content: body.content
//   };

//   articles.push(article);

//   LG(`Create ${MODULE}.  Article #${id} created.`);
//   res.json(article);
// };
// const dbAPI = 'https://script.google.com/macros/s/AKfycbyuyo0Wi60kHOFoswK3GTVVeWTfEEYF9JBl7NoL4nAxe08t9fo/exec';
const dbAPI = 'https://script.google.com/macros/s/AKfycbwYXfwWirehfqH4F8KF-RUCOq65DJ0kYHPH86q9iqyPbNscYQ/exec';
const payload = '8CUj01QVX9tDqUuE%2FwE3CPEPqWi%2FG85iIfjf71%2Fv61eZuFEdwMjl7tTxsOIqom7N26Q6Og%3D%3D';

const doRetrieve = (req, res, next) => {
  LG(`\n\n\n\n******* Getting ${MODULE}  ******\n\n\n`);

  let urltext = utils.wrapParams(req);
  LG(`'testGetPage', 'encoded ciphertext', ${payload} payload` );

  let call = `${dbAPI}?q=${urltext}`;
  LG(call);


var args = {
  requestConfig: {
    timeout: 140000, //request timeout in milliseconds
  },
  responseConfig: {
    timeout: 140000 //response timeout
  }
};

  (new Backend).get(call, args, (data, response) => {
    LG('\n\n\n\n*************************');
    LG(data);
    // LG('.............');
    // LG(payload);
    // LG(urltext);
    LG('*************\n\n\n\n');

    res.json(data);
    return;

  })
}

const doCreate = (req, res, next) => {
    const data = { x: 'Not implemented'}
    LG('\n\n\n\n*********  doCreate ***********');
    LG(data);
    LG('*************\n\n\n\n');

    res.json(data);
    return;
}

const doList = (req, res, next) => {
  LG(`\n\n\n\n******* Listing all ${MODULE}s ******\n\n\n`);

  let urltext = utils.wrapParams(req);
  LG(`'testGetPage', 'encoded ciphertext', ${payload} payload` );

  let call = `${dbAPI}?q=${urltext}`;
  LG(call);
  (new Backend).get(call, (data, response) => {
    LG('\n\n\n\n*************************');
    LG(data);
    // LG('.............');
    // LG(payload);
    // LG(urltext);
    LG('*************\n\n\n\n');

    res.json(data);
    return;

  })
};

// const doRetrieve = (req, res, next) => {
//   const article = articles.find(a => a.id.toString() === req.params.id);
//   const index = articles.indexOf(article);

//   LG(`Retrieve ${MODULE} Article #${req.params.id} retrieved.`);
//   res.json(articles[index]);

//   // const secrets = req.webtaskContext.secrets;
//   // const oauth2Client = new OAuth2Client(
//   //     secrets.GOOGLE_CLIENTID,
//   //     secrets.GOOGLE_CLIENTSECRET,
//   //     secrets.GOOGLE_REDIRECT_URI
//   // );
//   // const provider = req.user.providers[0];
//   // const creds = {
//   //     access_token: provider.tkn,
//   //     refresh_token: provider.rfr
//   // }
//   // oauth2Client['credentials'] = creds;


//   // gapis.sheets('v4').spreadsheets.values.get({
//   //     auth: oauth2Client,
//   //     spreadsheetId: '1NITk258-perOnxMk4iqeRvLDLMlasuZXNEM1J82kcEk',
//   //     range: 'Screwy!A1:B4',
//   // }, function(err, response) {
//   //     if (err) {
//   //       LG('The API returned an error: ' + err);
//   //       return;
//   //     }
//   //     if ( response ) {
//   //         LG(' response ');
//   //         LG( response );
//   //         var rows = response.values;
//   //         if ( rows && rows.length > 0) {
//   //           LG('A, B');
//   //           for (var i = 0; i < rows.length; i++) {
//   //             var row = rows[i];
//   //             // Print columns A and E, which correspond to indices 0 and 4.
//   //             LG('%s, %s', row[0], row[4]);
//   //           }
//   //         } else {
//   //           LG('No data found.');
//   //         }
//   //     } else {
//   //       LG('Got no response at all.');
//   //     }
//   // });
// };

// const doUpdate = (req, res, next) => {
//   LG(`Update ${MODULE}/${req.params.id}.  Not implemented.`);
//   res.json(  {
//     id: 9999999999,
//     title: '',
//     content: '',
//   });
//   next();
// };

// const doReplace = (req, res, next) => {
//   const { body } = req;
//   const article = articles.find(a => a.id.toString() === req.params.id);
//   const index = articles.indexOf(article);

//   if (index >= 0) {
//     article.title = body.title;
//     article.content = body.content;
//     articles[index] = article;
//   }

//   LG(`Replace ${MODULE}.  Article #${article.id} was replaced.`);
//   res.json(article);
//   next();
// };
// const doDelete = (req, res, next) => {
//   const article = articles.find(a => a.id.toString() === req.params.id);
//   const index = articles.indexOf(article);

//   if (index >= 0) articles.splice(index, 1);

//   LG(`Delete ${MODULE}.  Article #${req.params.id} deleted.`);
//   res.status(202).send();
// };

export default {
  POST: (req, res, next) => doCreate(req, res, next),
  GET: (req, res, next) => doRetrieve(req, res, next),
  LIST: (req, res, next) => doList(req, res, next),
  // PATCH: (req, res, next) => doReplace(req, res, next),  // FIXME
  // PUT: (req, res, next) => doReplace(req, res, next),
  // DELETE: (req, res, next) => doDelete(req, res, next),
}
