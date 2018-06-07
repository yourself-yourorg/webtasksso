import articles from './article';
import person from './person';
import product from './product';
import invoice from './invoice';


const LG = console.log;

const modules = {
  articles,
  person,
  product,
  invoice,
};

export default {
  POST: (req, res, next) => modules[req.params.module].POST(req, res, next),
  GET: (req, res, next) => modules[req.params.module].GET(req, res, next),
  LIST: (req, res, next) => modules[req.params.module].LIST(req, res, next),
  PATCH: (req, res, next) => modules[req.params.module].PATCH(req, res, next),
  PUT: (req, res, next) => modules[req.params.module].PUT(req, res, next),
  DELETE: (req, res, next) => modules[req.params.module].DELETE(req, res, next),
}
