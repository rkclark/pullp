# Pullp

Pullp is a tool to help you manage pull requests and reviews on your Github repositories, available for Mac and Linux.

An interactive dashboard shows all the open pull requests for your chosen repositories and highlights where your review has been requested. This information syncs with Github every minute!

<img src="https://i.imgur.com/O1qEiT5.png" alt="pullp example" width="600px" />

Want to find out more about the pull requests on a particular repository? Selecting a repository shows a full summary of each pull request, including all of the requested reviewers and submitted reviews. If you need to action anything, a click will take you directly to the pull request in Github.

<img src="https://i.imgur.com/fbjBWAA.png" alt="pullp example" width="600px" />

Pullp is an Electron application built with React.

## Getting Started

- Download and install the latest release.
- Open the app
- Follow the on screen instructions to sign in with Github
- Select the repositories you want to monitor with Pullp (you are able to choose from all the ones that you __watch__ on Github
- Click Monitor to go to the dashboard screen.
- Pullp will refresh the dashboard every minute!

## FAQs

Q: Why does my repository only show a maximum of 50 open pull requests?

A: Github applies a cost in points to each request Pullp makes for data. Each hour you are permitted to spend 5000 points. By restricting the maximum pull requests to 50, the cost of each request is manageable. This means Pullp can make more frequent requests, giving you a more "near-time" experience. Allowing this maximum limit to be configurable by the user could be a feature in the future.

Q: I am seeing an error saying `The amount of pull request data for your selected repositories exceeds Github's maximum limit.`

A: Github places a limit on the maximum number of data nodes that can be returned from a single request. This limit may be breached if you have selected a large number of repositories that have many pull requests. The only solution to this currently is to select fewer repositories.

Q: Can I access the console/Chrome dev tools inside the app?

A: Yes! Just use the normal Chrome shortcut to open them, e.g. cmd + opt + i on Mac. React and Redux dev tools are not available in the production app, but are enabled if you are running the app in the dev environment.

Q: I can't see my repository on the Select screen.

A: Make sure you are _watching_ the repository in Github, otherwise it won't appear on the select screen.

## Developer Instructions

### Running dev environment

After `npm install`, run `npm start` to start the webpack dev server. Once running, run `npm run electron-dev` to open the app.

React and Redux dev tools will be available inside the Chrome dev tools.

### Running the oAuth server

Pullp uses an external auth server to complete Github sign in and receive a code for the Github API. You may want to host a local version of this server. Clone it from https://github.com/rkclark/pullp-oauth-gatekeeper, run it on the port of your choosing and then add the server URL to `REACT_APP_OAUTH_GATEKEEPER_URL` in the `/env/.env.development` file inside of Pullp.

Your oauth server will need set of Github oAuth app credentials. To make these:

- In Github, go to your settings
- Go to **Developer Settings**, select oAuth Apps (usually selected by default)
- Click **New oAuth App**
- Give the app a name, this will be seen when/if your app requests access to any organisations that you are a part of. I suggest `pullp`!
- Set the homepage to whatever you like
- The authorization callback URL is not actually used by Pullp, I'd suggest just setting it to `http://localhost:3001/auth/github/callback`
- Click to register the app
- Make a note of the **client ID** and **client secret** that you are shown on the next screen

Once you have the credentials, create a new `.env` file in the server project root and add them as
```
OAUTH_CLIENT_ID=xxx
OAUTH_CLIENT_SECRET=xxx
```

### Running the tests

Run `npm test`.

### Other developer scripts

 - `npm run serve`: Run a server that hosts the production files
- `npm run build`: Build the React/CSS production files
- `npm run style`: Run the linter report
- `npm run style-fix`: Fix all auto-fixable lint errors
- `npm run precommit`: Runs the linter and test suite - used by Husky whenever a git commit is created
- `npm run electron`: Runs electron against the built production files,
- `npm run pack`: Packages distributable for the current OS and leaves unpackaged files available for inspection for debugging
- `npm run dist`: Builds the production files and then packages them into a distributable for the current OS

