const express = require('express');
const path = require('path');
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');

app.set('trust proxy', '127.0.0.1');

app.use(express.static(path.join(__dirname, 'build')));

app.use('/api/v1', (req, res, next) => {
  req.headers['x-forwarded-for'] = req.connection.remoteAddress;
  next();
}, createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
}));

app.use(function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(3000);