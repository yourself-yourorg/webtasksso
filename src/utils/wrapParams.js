import Tea from './tea';

var dataForGetPage = {};

const wrapParams = (req, mode) => {
  // LG(`'wrapParams', 'req.params', ${JSON.stringify(req.params)}` );
  dataForGetPage.store = req.params.module;
  dataForGetPage.mode = mode;
  if ( req.query ) {
    if ( req.query.c ) dataForGetPage.size = req.query.c;
    if ( req.query.s ) dataForGetPage.start = req.query.s;
  };

  if ( req.params.id ) dataForGetPage.id = req.params.id;
  if ( req.params.email ) dataForGetPage.email = req.params.email;

  // LG(`'wrapParams', 'dataForGetPage', ${dataForGetPage}`);
  // LG(dataForGetPage);
  let parameters = JSON.stringify(dataForGetPage);
  // LG(`'wrapParams', 'parameters', ${parameters}` );
  //   LG(Tea);
  let ciphertext = Tea.encrypt(parameters, 'MTUyMDE5NTQ4NTE2Mg');
  // LG(`'wrapParams', 'ciphertext', ${ciphertext}` );
  let urltext = encodeURIComponent(ciphertext);
  // LG(`'wrapParams', 'encoded ciphertext', ${urltext} urltext` );

  return urltext;
};

export default wrapParams;