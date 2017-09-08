const queryString = require('querystring');
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());
// app.get('/authenticate/:code', (req, res) => {
//   console.log(`authenticating code:${req.params.code}`);
//   authenticate(req.params.code, (err, token) => {
//     const result = err || !token ? { error: 'bad_code' } : { token };
//     console.log(result);
//     res.json(result);
//   });
// });

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
  const result = await gitHubResponse.json();
  console.log(result);
  res.send(200);
});

// authenticate(req.params.code, (err, token) => {
//   const result = err || !token ? { error: 'bad_code' } : { token };
//   console.log(result);
//   res.json(result);
// });
const port = 9821;

app.listen(port, null, err => {
  console.log(`Gatekeeper, at your service: http://localhost:${port}`);
});
// Load config defaults from JSON file.
// Environment variables override defaults.
// function loadConfig() {
//   let config = JSON.parse(fs.readFileSync(`${__dirname }/config.json`, 'utf-8'));
//   for (let i in config) {
//     config[i] = process.env[i.toUpperCase()] || config[i];
//   }
//   console.log('Configuration');
//   console.log(config);
//   return config;
// }

// let config = loadConfig();

// function authenticate(code, cb) {
//   let data = qs.stringify({
//     client_id: config.oauth_client_id,
//     client_secret: config.oauth_client_secret,
//     code,
//   });

//   let reqOptions = {
//     host: config.oauth_host,
//     port: config.oauth_port,
//     path: config.oauth_path,
//     method: config.oauth_method,
//     headers: { 'content-length': data.length },
//   };

//   let body = '';
//   let req = https.request(reqOptions, (res) => {
//     res.setEncoding('utf8');
//     res.on('data', (chunk) => { body += chunk; });
//     res.on('end', () => {
//       cb(null, qs.parse(body).access_token);
//     });
//   });

//   req.write(data);
//   req.end();
//   req.on('error', (e) => {
//     cb(e.message);
//   });
// }

// Convenience for allowing CORS on routes - GET only
// app.all('*', (req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });
