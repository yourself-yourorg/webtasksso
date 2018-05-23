import { Client as Backend} from 'node-rest-client';
import { wrapParams } from '../../utils';
// import Ipsum from 'bavaria-ipsum';

// const ipsum = new Ipsum();

const LG = console.log;
const MODULE = 'person';

const urlExec = 'https://script.google.com/macros/s/AKfycbwYXfwWirehfqH4F8KF-RUCOq65DJ0kYHPH86q9iqyPbNscYQ/exec';
const urlDev = 'https://water.iridium.blue:gm%&RT+98+98@script.google.com/macros/s/AKfycbysbJ_YwiPPvn_bjGifJjsRa8LlwRlo4Q3nzS6i-g/dev';

// *************************
// const dbAPI = urlDev;
const dbAPI = urlExec;
// *************************

// const payload = '8CUj01QVX9tDqUuE%2FwE3CPEPqWi%2FG85iIfjf71%2Fv61eZuFEdwMjl7tTxsOIqom7N26Q6Og%3D%3D';

const doRetrieve = (req, res, next) => {
  LG(`\n\n\n\n******* Getting ${MODULE}  ******\n\n\n`);

  let urltext = wrapParams(req);
  // LG(`'testGetPage', 'encoded ciphertext', ${payload} payload` );

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

const doCreate = (req, res, next, mode) => {
  LG('\n\n\n\n*********  doCreate ***********');
  LG('req.body.data');
  LG(req.body.data);
  LG('mode');
  LG(mode);
  LG('*************\n\n\n\n');

  let urltext = wrapParams(req, mode);

  var args = {
    requestConfig: {
      timeout: 140000, //request timeout in milliseconds
    },
    responseConfig: {
      timeout: 140000 //response timeout
    },
    data: req.body.data,
    headers: { "Content-Type": "application/json" }
  };

  // let call = `${dbAPI}?q=${urltext}`;
  let call = `${dbAPI}?q=${urltext}`;
  LG(call);
  (new Backend).post(call, args, (data, response) => {
    LG('\n\n\n\n*********** returning **************');
    LG('data');
    LG(data);

    if (data.length) {
      let val = '';
      for (let ii = 0 ; ii < data.length ; ii += 1) {
        val += String.fromCharCode(data[ii]);
      }
      LG(val);
    }

    // LG('-----');
    // LG(response);
    LG('*************\n\n\n\n');

    res.json(data);
    return;

  })
}

const doList = (req, res, next, mode) => {
  LG(`\n\n\n\n******* Listing all ${MODULE}s ******\n\n\n`);
  LG(req.params);
  let urltext = wrapParams(req, mode);
  // LG(`'testGetPage', 'encoded ciphertext', ${payload} payload` );

  let call = `${dbAPI}?q=${urltext}`;
  LG(call);
  (new Backend).get(call, (data, response) => {
    LG(`********** Last ${req.params.module} *********`);
    const list = data[req.params.module].data;
    LG(list[list.length - 1]);
    LG('.............');
    // LG(data[req.params.module].enums);
    // LG(data);
    // LG(urltext);

    res.json(data);
    LG(`************* sent ************`);
    return;

  })
};

const doUpdate = (req, res, next, mode) => {
  LG(`Update ${MODULE}/${req.params.id}.  Not implemented yet.`);
  LG('req.body.data');
  LG(req.body.data);
  LG('mode');
  LG(mode);
  LG('*************\n\n\n\n');

  let urltext = wrapParams(req, mode);

  var args = {
    requestConfig: {
      timeout: 140000, //request timeout in milliseconds
    },
    responseConfig: {
      timeout: 140000 //response timeout
    },
    data: req.body.data,
    headers: { "Content-Type": "application/json" }
  };

  // let call = `${dbAPI}?q=${urltext}`;
  let call = `${dbAPI}?q=${urltext}`;
  LG(call);
  (new Backend).post(call, args, (data, response) => {
    LG('\n\n\n\n*********** returning **************');
    LG('data');
    LG(data);

    if (data.length) {
      let val = '';
      for (let ii = 0 ; ii < data.length ; ii += 1) {
        val += String.fromCharCode(data[ii]);
      }
      LG(val);
    }

    // LG('-----');
    // LG(response);
    LG('*************\n\n\n\n');

    res.json(data);
    return;

  })
};

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
  POST: (req, res, next, mode) => doCreate(req, res, next, mode),
  // POST: (req, res, next, mode) => {
  //   LG('**************  Got Here   ******************');
  //   LG(req.body);
  // },
  GET: (req, res, next, mode) => doRetrieve(req, res, next, mode),
  LIST: (req, res, next, mode) => doList(req, res, next, mode),
  PATCH: (req, res, next, mode) => doUpdate(req, res, next, mode),
  // PUT: (req, res, next, mode) => doReplace(req, res, next, mode),
  // DELETE: (req, res, next, mode) => doDelete(req, res, next, mode),
}
