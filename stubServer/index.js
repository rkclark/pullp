/* eslint-disable no-console */
const queryString = require('querystring');
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/oauth/authorize', async (req, res) => {
  console.log(req.body);

  const htmlPath = path.resolve(__dirname, 'githubLogin.html');
  const content = fs.readFileSync(htmlPath, 'utf8');
  console.log(content);
  res.send(content);
});

app.post('/authenticate/', async (req, res) => {
  console.log(req.body);
  const oAuthParams = queryString.stringify(req.body);
  const gitHubResponse = await fetch(
    `https://github.com/login/oauth/access_token?${oAuthParams}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      } //eslint-disable-line
  );
  if (gitHubResponse.ok) {
    const result = await gitHubResponse.json();
    res.json(result);
  } else {
    console.log(gitHubResponse);
    res.sendStatus(500);
  }
});

app.listen(3334, null, () => {
  console.log(`Pullp oAuth token server running on: http://localhost:3334`);
});
