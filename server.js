process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV === 'development';
const port = parseInt(process.env.PORT || '3000', 10);
const app = next({ dev, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Server ready in ${dev ? 'development' : 'production'} mode on port ${port}`);
  });
});
