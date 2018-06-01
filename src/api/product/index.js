import { Client as Backend} from 'node-rest-client';
import { wrapParams } from '../../utils';
// import Ipsum from 'bavaria-ipsum';

// const ipsum = new Ipsum();

const LG = console.log;
const MODULE = 'product';


// const payload = '8CUj01QVX9tDqUuE%2FwE3CPEPqWi%2FG85iIfjf71%2Fv61eZuFEdwMjl7tTxsOIqom7N26Q6Og%3D%3D';

const doList = (req, res, next, mode) => {
  LG(`\n\n\n\n******* Listing all ${MODULE}s ******\n\n\n`);
  LG(req.params);
  let urltext = wrapParams(req, mode);
  // LG(`'testGetPage', 'encoded ciphertext', ${payload} payload` );

  let call = `${req.webtaskContext.secrets.BACKEND_URL}?q=${urltext}`;
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


export default {
  LIST: (req, res, next, mode) => doList(req, res, next, mode),
}
