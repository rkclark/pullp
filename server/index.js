const queryString = require('querystring');
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 9821;

app.post('/authenticate/', async (req, res) => {
  console.log(req.body);
  const oAuthParams = queryString.stringify(req.body);
  const gitHubResponse = await fetch(
    `https://github.com/Account/oauth/access_token?${oAuthParams}`,
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

app.listen(port, null, () => {
  console.log(`Pullp oAuth token server running on: http://localhost:${port}`);
});
