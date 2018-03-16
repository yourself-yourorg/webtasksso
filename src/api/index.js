import articles from './article';
import person from './person';

const LG = console.log;

const modules = {
  articles,
  person,
};
// export default (req, res, next) => {
//   LG(`Module :: ${req.params.module} Method :: ${req.method}`)
//   modules[req.params.module][req.method](req, res, next);
//   LG('* * * Finished sending API response\n');
//   next();
// }

export default {
  POST: (req, res, next) => modules[req.params.module].POST(req, res, next),
  GET: (req, res, next) => modules[req.params.module].GET(req, res, next),
  LIST: (req, res, next) => modules[req.params.module].LIST(req, res, next),
  PATCH: (req, res, next) => {
    LG(req.param);
    modules[req.params.module].PATCH(req, res, next);
  },
  PUT: (req, res, next) => modules[req.params.module].PUT(req, res, next),
  DELETE: (req, res, next) => modules[req.params.module].DELETE(req, res, next),
}
