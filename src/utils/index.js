import Tea from './tea';

const LG = console.log;

var dataForGetPage = {
  size: "0",
  start: "0",
  store: "",
  id: ""
};

export const wrapParams = req => {
  LG(`'wrapParams', 'req.params', ${JSON.stringify(req.params)}` );
  dataForGetPage.size = req.query.c;
  dataForGetPage.start = req.query.s;
  dataForGetPage.store = req.params.module;
  dataForGetPage.id = req.params.id;

  LG(`'wrapParams', 'dataForGetPage', ${dataForGetPage}`);
  LG(dataForGetPage);
  let parameters = JSON.stringify(dataForGetPage);
  LG(`'testGetPage', 'parameters', ${parameters}` );
    LG(Tea);
  let ciphertext = Tea.encrypt(parameters, 'MTUyMDE5NTQ4NTE2Mg');
  LG(`'testGetPage', 'ciphertext', ${ciphertext}` );
  let urltext = encodeURIComponent(ciphertext);
  LG(`'testGetPage', 'encoded ciphertext', ${urltext} urltext` );

  return urltext;
};

export default {
  Tea,
  wrapParams,
};
