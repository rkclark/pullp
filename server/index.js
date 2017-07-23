const app = require('./app');
const server = require('http').createServer(app);

server.on('error', (err) => {
  console.log(err);
  process.exit(1);
});

server.on('listening', () => {
  console.log('server running on port %s', server.address().port);
});

// lets get this show on the road!
server.listen(3000);
