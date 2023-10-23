# Pullp <img src="https://travis-ci.com/rkclark/pullp.svg?branch=master" alt="pullp ci badge" align="right" />

## NOTICE: App is no longer in working state as the domain hosting for its oAuth proxy has expired and there are currently no plans to re-host it. (My current employer uses Gitlab rather than Github 😢)

Pullp is a tool to help you manage pull requests and reviews on your Github repositories, available for Mac, Linux and Windows.

An interactive dashboard shows all the open pull requests for your chosen repositories and highlights where your review has been requested. This information syncs with Github every minute! To help you keep track of things, Pullp has configurable desktop notifications to keep you in the loop.

<img src="https://i.imgur.com/wWzT5YD.png" alt="pullp example" width="900px" />

Want to find out more about the pull requests on a particular repository? Selecting a repository shows a full summary of each pull request, including all of the requested reviewers and submitted reviews. If you need to action anything, a click will take you directly to the pull request in Github.

<img src="https://i.imgur.com/zJ8Oe9O.png" alt="pullp example" width="900px" />

You are also shown the five most recently closed pull requests:

<img src="https://i.imgur.com/RheDqgK.png" alt="pullp example" width="900px" />

Want to change the way that Pullp notifies you of changes? On the settings screen you can toggle a number of different options:

<img src="https://i.imgur.com/auKynaO.png" alt="pullp example" width="500px" />

Pullp is an Electron application built with React.

## :zap: Getting Started

* Download and install the [latest release](https://github.com/rkclark/pullp/releases/). You'll want the `.dmg` file for MacOS or the `.AppImage` file for Linux
* Open the app
* On MacOS, if your security settings block you from opening the app, right-click it and select Open. You can then click Open on the warning dialogue that opens up.
* Follow the on screen instructions to sign in with Github
* Select the repositories you want to monitor with Pullp (you are able to choose from all the ones that you **watch** on Github
* Click Monitor to go to the dashboard screen.
* Pullp will refresh the dashboard every minute!

---

## :grey_question: FAQs

:question: Why does my repository only show a maximum of 50 open pull requests?

> :bulb: Github applies a cost in points to each request Pullp makes for data. Each hour you are permitted to spend 5000 points. By restricting the maximum pull requests to 50, the cost of each request is manageable. This means Pullp can make more frequent requests, giving you a more "near-time" experience. Allowing this maximum limit to be configurable by the user could be a feature in the future.

:question: I am seeing an error saying `The amount of pull request data for your selected repositories exceeds Github's maximum limit.`

> :bulb: Github places a limit on the maximum number of data nodes that can be returned from a single request. This limit may be breached if you have selected a large number of repositories that have many pull requests. The only solution to this currently is to select fewer repositories.

:question: Can I access the console/Chrome dev tools inside the app?

> :bulb: Yes! Just use the normal Chrome shortcut to open them, e.g. cmd + opt + i on Mac. React and Redux dev tools are not available in the production app, but are enabled if you are running the app in the dev environment.

:question: I can't see my repository on the Select screen.

> :bulb: Make sure you are _watching_ the repository in Github, otherwise it won't appear on the select screen.

---

## :checkered_flag: Developer Instructions :checkered_flag:

### :rocket: Running dev environment - The simplest way

After `npm install`, run `npm start` to start the webpack dev server and electron app.

React and Apollo dev tools will be available inside the Chrome dev tools.

### :white_check_mark: Running the tests

* Run `npm test`.
* To run the tests without the file watcher, run `npm run test:no-watcher`

### :dizzy: Optional - Running a local oAuth server

Pullp uses an external auth server to complete Github sign in and receive a token for the Github API. You may want to host a local version of this server. Clone it from https://github.com/rkclark/pullp-oauth-gatekeeper, run it on the port of your choosing and then add the server URL to `REACT_APP_OAUTH_GATEKEEPER_URL` in the `/env/.env.development` file inside of Pullp.

If you are connecting to a different GitHub domain than `github.com`, you can set `REACT_APP_GITHUB_DOMAIN` to that domain such as `github.mycompany.com`

Your oauth server will need set of Github oAuth app credentials. To make these:

* In Github, go to your settings
* Go to **Developer Settings**, select oAuth Apps (usually selected by default)
* Click **New oAuth App**
* Give the app a name, this will be seen when/if your app requests access to any organisations that you are a part of. I suggest `pullp`!
* Set the homepage to whatever you like
* The authorization callback URL is not actually used by Pullp, I'd suggest just setting it to `http://localhost:3001/auth/github/callback`
* Click to register the app
* Make a note of the **client ID** and **client secret** that you are shown on the next screen

Once you have the credentials, create a new `.env` file in the server project root and add them as

```
OAUTH_CLIENT_ID=xxx
OAUTH_CLIENT_SECRET=xxx
```

### :octocat: Optional - Stubbing Github

The project includes a server that provides stub responses for all external dependencies:

* Github login page
* Github oAuth flow
* Github GraphQl server

To run the stub server run `npm run stub`. This will start the server along with the webpack dev server. Then just run `npm run electron:start:dev` in another terminal window.

This can be used if you want to work offline or have finer control over the data being received by the app.

Limitations:

* The GraphQl endpoint is not a real GraphQl implementation! If you change any queries then they will not work without updating the stub endpoint to watch for them.
* To have repos appear on the dashboard, do not select any on the Select screen
* Images are not currently stubbed so will simply not be loaded

### :crystal_ball: Other developer scripts

* `npm run serve`: Run a server that hosts the production files
* `npm run react:build`: Build the React/CSS production files
* `npm run style`: Run the linter report
* `npm run style-fix`: Fix all auto-fixable lint errors
* `npm run precommit`: Runs the linter and test suite - used by Husky whenever a git commit is created
* `npm run electron`: Runs electron against the built production files,
* `npm run pack`: Packages distributable for the current OS and leaves unpackaged files available for inspection for debugging
* `npm run dist`: Builds the production files and then packages them into a distributable for the current OS
* `npm run ship`: Builds the production files, packages them for the current OS, and then pushes them to a draft Github release on the Pullp repository. For this to work, you must have the relevant access rights on the Pullp repository. In addition, you must create a personal token on Github and add it as `GH_TOKEN=**YOURTOKEN**` in a new file `electron-builder.env` in the project root. See `electron-builder.example.env` for an example.
* `npm run install-wsl`: Installs linux versions of all packages except for Electron which is installed as the Windows version. For use when developing using Windows Subsystem for Linux (WSL). This is currently the best workaround available.

### :shipit: CI/CD and Releasing

Pullp uses Github Actions for CI/CD. This is configured so that any branch that is pushed with a name in the format vX.X.X will be automatically packaged for Mac and Linux and uploaded to Github as a draft release.

e.g.

* a branch with a name `v1.9.70` will be created as a draft release with the Windows, Mac and Linux installation files attached.

Once the draft release is on Github it can have release notes added and then be published! :ok_hand:
