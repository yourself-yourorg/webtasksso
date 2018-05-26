import Ipsum from 'bavaria-ipsum';

const ipsum = new Ipsum();

const LG = console.log;
const MODULE = 'article';

const articles = [
  {
    id: 1,
    title: ipsum.generateSentence(),
    content: ipsum.generateParagraph()
  },
  {
    id: 2,
    title: ipsum.generateSentence(),
    content: ipsum.generateParagraph()
  },
  {
    id: 3,
    title: ipsum.generateSentence(),
    content: ipsum.generateParagraph()
  }
];

const doCreate = (req, res, next) => {
  const id = articles[articles.length - 1].id + 1;
  const { body } = req;

  const article = {
    id,
    title: body.title,
    content: body.content
  };

  articles.push(article);

  LG(`Create ${MODULE}.  Article #${id} created.`);
  res.json(article);
};

const doList = (req, res, next) => {
  LG(`Listing all ${MODULE}s..`);
  LG(req);
  res.json(articles);
  return;
};

const doRetrieve = (req, res, next) => {
  LG(`Retrieving ${MODULE} #${req.params.id} .***********************************************************`);

  for (let prop in req) {
    if (req.hasOwnProperty(prop)) {
      LG(`Property: ${prop}`);
    }
  }

  LG(`Property 'req.method': ${req.method}`);
  LG(`Property 'req.user': `);
  LG(req.user);
  LG(`Property 'req.route': `);
  LG(req.route);
  LG(`Property 'req.body': `);
  LG(req.body);
  LG(`Property 'req.query': `);
  LG(req.query);
  LG(`Property 'req.params': `);
  LG(req.params);


  const article = articles.find(a => a.id.toString() === req.params.id);
  const index = articles.indexOf(article);

  LG(`Retrieve ${MODULE} Article #${req.params.id} retrieved.`);
  res.json(articles[index]);

};

const doUpdate = (req, res, next) => {
  LG(`Update ${MODULE}/${req.params.id}.  Not implemented.`);
  res.json(  {
    id: 9999999999,
    title: '',
    content: '',
  });
  next();
};

const doReplace = (req, res, next) => {
  const { body } = req;
  const article = articles.find(a => a.id.toString() === req.params.id);
  const index = articles.indexOf(article);

  if (index >= 0) {
    article.title = body.title;
    article.content = body.content;
    articles[index] = article;
  }

  LG(`Replace ${MODULE}.  Article #${article.id} was replaced.`);
  res.json(article);
  next();
};
const doDelete = (req, res, next) => {
  const article = articles.find(a => a.id.toString() === req.params.id);
  const index = articles.indexOf(article);

  if (index >= 0) articles.splice(index, 1);

  LG(`Delete ${MODULE}.  Article #${req.params.id} deleted.`);
  res.status(202).send();
};

export default {
  POST: (req, res, next) => doCreate(req, res, next),
  GET: (req, res, next) => doRetrieve(req, res, next),
  LIST: (req, res, next) => doList(req, res, next),
  PATCH: (req, res, next) => doReplace(req, res, next),  // FIXME
  PUT: (req, res, next) => doReplace(req, res, next),
  DELETE: (req, res, next) => doDelete(req, res, next),
}
