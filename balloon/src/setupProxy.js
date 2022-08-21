const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    '/auth',
    // '/chatstart',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  );
  // app.use(
  //   '/auth',
  //   createProxyMiddleware({
  //     target: 'http://localhost:8080',
  //     changeOrigin: true,
  //   })
  // );
  // app.use(
  // app.use(
  //   '/box',
  //   createProxyMiddleware({
  //     target: 'http://localhost:8080',
  //     changeOrigin: true,
  //   })
  // );
};
