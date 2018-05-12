/* eslint-disable no-console */
const path = require('path');

module.exports = function setupProtocols(electron) {
  electron.protocol.interceptFileProtocol(
    'file',
    (request, callback) => {
      if (
        request.url.startsWith('file:///app') &&
        !request.url.includes('/static/')
      ) {
        callback({
          path: path.resolve(__dirname, '../../build/index.html'),
        });
        return;
      }

      let strippedUrl = request.url.substr(7); /* all urls start with 'file://' */ // eslint-disable-line

      if (strippedUrl.includes('index.html')) {
        callback({ path: strippedUrl });
        return;
      }

      if (strippedUrl.startsWith('/app')) {
        strippedUrl = strippedUrl.substr(
          4,
        ); /* static asset requests from a /app/ path will not work */
      }

      const newPath = strippedUrl.startsWith('/static')
        ? path.resolve(__dirname, `../../build/${strippedUrl}`)
        : path.resolve(`/${strippedUrl}`);

      callback({ path: newPath });
    },
    err => {
      if (err) console.error('Failed to register protocol');
    },
  );
};
