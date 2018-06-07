import { Client as Backend} from 'node-rest-client';
import utilities from '../../utils';
// import {
//   wrapParams,
//   doList as genericDoList,
// } from '../../utils';

const LG = console.log;
const MODULE = 'invoice';

// const payload = '8CUj01QVX9tDqUuE%2FwE3CPEPqWi%2FG85iIfjf71%2Fv61eZuFEdwMjl7tTxsOIqom7N26Q6Og%3D%3D';

const doList = (req, res, next, mode) => {
  LG(`\n\n\n\n******* Listing all ${MODULE}s ******\n\n\n`);
  utilities.doList(req, res, next, mode);
  // LG(`\n\n\n\n******* Listing all ${MODULE}s ******\n\n\n`);
  // LG(req.params);
  // let urltext = utilities.wrapParams(req, mode);
  // // LG(`'testGetPage', 'encoded ciphertext', ${payload} payload` );

  // let call = `${req.webtaskContext.secrets.BACKEND_URL}?q=${urltext}`;
  // LG(call);
  // (new Backend).get(call, (data, response) => {
  //   LG(`********** Last ${req.params.module} *********`);
  //   const list = data[req.params.module].data;
  //   LG(list[list.length - 1]);
  //   LG('.............');
  //   // LG(data[req.params.module].enums);
  //   // LG(data);
  //   // LG(urltext);

  //   res.json(data);
  //   LG(`************* sent ************`);
  //   return;

  // })
};

export const getInvoice = (request, cb) => {

  LG(
    `getInvoice: `);
  LG( request.webtaskContext.secrets );

  let urltext = utilities.wrapParams(request, 'get');

  let call = `${request.webtaskContext.secrets.BACKEND_URL}?q=${urltext}`;
  LG('call');
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
    LG('\n\n\n\n************ getInvoice *************');
    LG(data);
    // LG('.............');
    // LG(payload);
    // LG(urltext);
    LG('*************\n\n\n\n');

    cb('', data)
    // if (res) res.json(data);
    // return data;

  });

};


const doRetrieve = (req, res, next) => {
  LG(`\n\n\n\n******* Getting ${MODULE}  ******\n\n\n`);

  getInvoice(req, res)
  // LG(`'testGetPage', 'encoded ciphertext', ${payload} payload` );

}

const doCreate = (req, res, next, mode) => {
  LG('\n\n\n\n*********  doCreate ***********');
  LG('req.body.data');
  LG(req.body.data);
  LG('mode');
  LG(mode);
  LG('*************\n\n\n\n');

  let urltext = utilities.wrapParams(req, mode);

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

  let call = `${req.webtaskContext.secrets.BACKEND_URL}?q=${urltext}`;
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

const doUpdate = (req, res, next, mode) => {
  LG(`Update ${MODULE}/${req.params.id}.  Not implemented yet.`);
  LG('req.body.data');
  LG(req.body.data);
  LG('mode');
  LG(mode);
  LG('*************\n\n\n\n');

  let urltext = utilities.wrapParams(req, mode);

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

  let call = `${req.webtaskContext.secrets.BACKEND_URL}?q=${urltext}`;
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

export default {
  POST: (req, res, next, mode) => doCreate(req, res, next, 'post'),
  GET: (req, res, next, mode) => doRetrieve(req, res, next, 'get'),
  LIST: (req, res, next) => doList(req, res, next, 'list'),
  PATCH: (req, res, next, mode) => doUpdate(req, res, next, 'patch'),
  // PUT: (req, res, next, mode) => doReplace(req, res, next, 'put'),
  // DELETE: (req, res, next, mode) => doDelete(req, res, next, 'delete'),
}
