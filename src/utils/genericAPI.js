import { Client as Backend} from 'node-rest-client';
import wrapParams from './wrapParams';

const LG = console.log;

export const doList = (req, res, next, mode) => {
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

