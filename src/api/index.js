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
  POST: (req, res, next) => modules[req.params.module].POST(req, res, next, 'post'),
  GET: (req, res, next) => modules[req.params.module].GET(req, res, next, 'get'),
  LIST: (req, res, next) => modules[req.params.module].LIST(req, res, next, 'list'),
  PATCH: (req, res, next) => modules[req.params.module].PATCH(req, res, next, 'patch'),
  PUT: (req, res, next) => modules[req.params.module].PUT(req, res, next, 'put'),
  DELETE: (req, res, next) => modules[req.params.module].DELETE(req, res, next, 'delete'),
}
