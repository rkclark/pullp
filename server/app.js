const path = require('path');
const express = require('express');
const helmet = require('helmet');

const app = express();
const srcFolder = process.env.NODE_ENV === 'test' ? '../public' : '../build';

app.use(helmet());

// used for webops healthchecks & deployment.
app.get('/private/ping', (req, res) => {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.status(200).send('pong');
});

app.use(express.static(path.join(__dirname, srcFolder)));

// Serve single page app to allow routing to occur on front end
app.use((req, res, next) => {
  (req.method === 'GET' || req.method === 'HEAD') && req.accepts('html')
    ? res.sendFile(path.resolve(__dirname, srcFolder, 'index.html'), next)
    : next();
});

module.exports = app;
