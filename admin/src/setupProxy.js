const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/socket.io',
    (req, res, next) => {
      req.headers['x-forwarded-for'] = req.connection.remoteAddress;
      req.header['user-agent'] = req.header['user-agent']
      next();
    },
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
    })
  );
  app.use(
    '/api/v1',
    (req, res, next) => {
      req.headers['x-forwarded-for'] = req.connection.remoteAddress;
      req.header['user-agent'] = req.header['user-agent']
      next();
    },
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
    })
  );
};