/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Expected graphql queries
const getUserQuery = require('./expectedGraphqlQueries/user');
const getUserTeamsQuery = require('./expectedGraphqlQueries/userTeams');
const getWatchedReposQuery = require('./expectedGraphqlQueries/watchedRepos');
const getPullRequestsQuery = require('./expectedGraphqlQueries/pullRequests');

// Graphql responses
const getUserResponse = require('./graphqlResponses/user');
const getUserTeamsResponse = require('./graphqlResponses/userTeams');
const getWatchedReposResponse = require('./graphqlResponses/watchedRepos');
const getPullRequestsResponse = require('./graphqlResponses/pullRequests');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/oauth/authorize', async (req, res) => {
  const htmlPath = path.resolve(__dirname, 'githubLogin.html');
  const content = fs.readFileSync(htmlPath, 'utf8');
  console.log('Stub server received GET /oauth/authorize');
  console.log('Stub server returning fake Github sign in page');
  res.send(content);
  console.log('------------------------------');
});

app.get('/authenticate/*', async (req, res) => {
  console.log('Stub server received GET /authenticate/');
  console.log('Stub server fake Github token');
  const response = JSON.stringify({ token: '123456789' });
  res.send(response);
  console.log('------------------------------');
});

// Stringify then remove spaces and \n from string
const stringify = string => JSON.stringify(string).replace(/(\s|\\n)/gm, '');

app.post('/graphql', async (req, res) => {
  console.log('Stub server received POST /graphql');

  const userLogin = 'dev';

  const userQuery = stringify(getUserQuery());
  const userTeamsQuery = stringify(getUserTeamsQuery(userLogin));
  const watchedReposQuery = stringify(getWatchedReposQuery());
  const pullRequestsQuery = stringify(getPullRequestsQuery([], 50));

  const receivedQuery = stringify(req.body);
  console.log('Received query is:\n', receivedQuery);

  switch (receivedQuery) {
    case userQuery: {
      console.log('Stub server returning user response');
      const userResponse = stringify(getUserResponse(userLogin));
      res.send(userResponse);
      break;
    }
    case userTeamsQuery: {
      console.log('Stub server returning user teams response');
      const userTeamsResponse = stringify(getUserTeamsResponse());
      res.send(userTeamsResponse);
      break;
    }
    case watchedReposQuery: {
      console.log('Stub server returning watched repos response');
      const watchedReposResponse = stringify(getWatchedReposResponse());
      res.send(watchedReposResponse);
      break;
    }
    case pullRequestsQuery: {
      console.log('Stub server returning pull requests response');
      const pullRequestsResponse = stringify(getPullRequestsResponse());
      res.send(pullRequestsResponse);
      break;
    }
    default: {
      console.log('Stub server cannot match graphql query:\n', receivedQuery);
      res.sendStatus(404);
    }
  }

  console.log('------------------------------');
});

app.listen(3334, null, () => {
  console.log(`Pullp stub server running on: http://localhost:3334`);
});
