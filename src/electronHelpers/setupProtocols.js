/* eslint-disable no-console */
const path = require('path');

module.exports = function setupProtocols(electron) {
  electron.protocol.interceptFileProtocol(
    'file',
    (request, callback) => {
      const strippedUrl = request.url.substr(7); /* all urls start with 'file://' */ // eslint-disable-line
      if (strippedUrl.includes('index.html')) {
        callback({ path: strippedUrl });
        return;
      }
      const newPath = strippedUrl.startsWith('/static')
        ? path.resolve(__dirname, `../build/${strippedUrl}`)
        : path.resolve(`/${strippedUrl}`);

      callback({ path: newPath });
    },
    err => {
      if (err) console.error('Failed to register protocol');
    },
  );
};
