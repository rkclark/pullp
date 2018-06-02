/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const getUserResponse = require('./graphqlResponses/user');
const getUserQuery = require('./expectedGraphqlQueries/user');
const getUserTeamsQuery = require('./expectedGraphqlQueries/userTeams');

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

// Stringify then remove spaces and \n from string
const stringify = string => JSON.stringify(string).replace(/(\s|\\n)/gm, '');

app.post('/graphql', async (req, res) => {
  console.log('Stub server received POST /graphql');

  const userLogin = 'dev';
  const userResponse = stringify(getUserResponse(userLogin));

  const userQuery = stringify(getUserQuery());
  const userTeamsQuery = stringify(getUserTeamsQuery(userLogin));

  const receivedQuery = stringify(req.body);
  console.log('Received query is:\n', receivedQuery);

  switch (receivedQuery) {
    case userQuery: {
      console.log('Stub server returning user response');
      res.send(userResponse);
      break;
    }
    case userTeamsQuery: {
      console.log('Stub server returning user teams response');
      res.sendStatus(404);
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
