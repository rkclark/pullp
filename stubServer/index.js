/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const userResponse = require('./graphqlResponses/user.json');
const userQuery = require('./expectedGraphqlQueries/user');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/oauth/authorize', async (req, res) => {
  const htmlPath = path.resolve(__dirname, 'githubLogin.html');
  const content = fs.readFileSync(htmlPath, 'utf8');
  console.log('Stub server received GET /oauth/authorize');
  console.log('Stub server returning fake Github sign in page');
  res.send(content);
});

app.get('/authenticate/*', async (req, res) => {
  console.log('Stub server received GET /authenticate/');
  console.log('Stub server fake Github token');
  const response = JSON.stringify({ token: '123456789' });
  res.send(response);
});

app.post('/graphql', async (req, res) => {
  console.log('Stub server received POST /graphql');

  switch (JSON.stringify(req.body)) {
    case JSON.stringify(userQuery): {
      console.log('Stub server returning user response');
      res.send(userResponse);
      break;
    }
    default: {
      res.sendStatus(404);
    }
  }
});

app.listen(3334, null, () => {
  console.log(`Pullp oAuth token server running on: http://localhost:3334`);
});
