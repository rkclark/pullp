# Pullp

Pullp is a tool to help you manage pull requests and reviews on your Github repositories, available for Mac and Linux.

An interactive dashboard shows all the open pull requests for your chosen repositories and highlights where your review has been requested. This information syncs with Github every minute!

![Pullp example](https://i.imgur.com/O1qEiT5.png)

Want to find out more about the pull requests on a particular repository? Selecting a repository shows a full summary of each pull request, including all of the requested reviewers and submitted reviews. If you need to action anything, a click will take you directly to the pull request in Github.

![Repo example](https://i.imgur.com/Wd3U3mN.png)

Pullp is built on Electron and is a single page React application. Each user is able to specify their own Github oAuth credentials which the app uses to query the Github Graphql API.

## Getting Started

First you will need to download and install the latest release.

Next you will need to create your own oAuth credentials that Pullp can use to communicate with Github.

### Creating your oAuth Credentials

When using Pullp you need to provide Github oAuth credentials. The way you should approach this will differ depending on whether you are using Pullp as an individual or if you are using it within an organisation.

If you are using Pullp within an organisation that has private repositories, you should create one set of oAuth credentials and share them with your colleagues. This way, your Github administrator will only need to approve one oAuth application to access the organisation. If you are an individual or you only require access to public repositories, you can make your own personal credentials.

_Note: the Github API applies a limit to the amount of data per hour that can be requested by an oAuth application. If you are sharing credentials within an organisation, you may hit that limit if too many users share one set of credentials. A rough estimate would be that around 30 users can use one set of credentials, assuming they choose to monitor around 10 repositories each. Pullp will display an error if the API limit is reached so you can always use that as an indication that another set of oAuth credentials is needed to spread the load._

#### How to make the credentials

- In Github, go to your settings
- Go to **Developer Settings**, select oAuth Apps (usually selected by default)
- Click **New oAuth App**
- Give the app a name, this will be seen when/if your app requests access to any organisations that you are a part of. I suggest `pullp`!
- Set the homepage to whatever you like
- The authorization callback URL is not actually used by Pullp, I'd suggest just setting it to `http://localhost:3001/auth/github/callback`
- Click to register the app
- Make a note of the **client ID** and **client secret** that you are shown on the next screen

### Signing In

Now you have your oAuth credentials, open Pullp. You will be asked to enter your client id and client secret. Once entered and saved, you can click to sign in to Github.

On the Github sign in window you can request any organisations that you are part of to authorise Pullp. Assuming they do so, you will be able to see their private repositories in addition to public ones.

Once you are signed in click `Let's Get Started`.

### Selecting the repositories you want to monitor

In the `Select` page you can choose which repos you want to monitor with Pullp. You will see listed all of the repositories that you **watch** on Github. If you don't see one of your repos, make sure you are watching it!

### Monitoring

The `Monitor` page shows all the repos you have selected, these are ordered by the number of pull requests they currently have open.

You can click on the repository name to open its page in Github.

Clicking the body of the repository frame will open a more detailed summary of the open pull requests.

## FAQs

Q: Why does my repository only show a maximum of 15 open pull requests?

A: Github applies a cost in points to each request Pullp makes for data. Each hour your oAuth app is permitted to spend 5000 points. By restricting the maximum pull requests to 15, the cost of each request is significantly reduced compared to, say, requesting 50. This means Pullp can make more frequent requests, giving you a more "near-time" experience. Allowing this maximum limit to be configurable by the user could be a feature in the future.

Q: I am seeing an error saying `The amount of pull request data for your selected repositories exceeds Github's maximum limit.`

A: Github places a limit on the maximum number of data nodes that can be returned from a single request. This limit may be breached if you have selected a large number of repositories that have many pull requests. The only solution to this currently is to select fewer repositories.

Q: Can I access the console/Chrome dev tools inside the app?

A: Yes! Just use the normal Chrome shortcut to open them, e.g. cmd + opt + i on Mac. React and Redux dev tools are not available in the production app, but are enabled if you are running the app in the dev environment.

## Developer Instructions

### Running dev environment

After `npm install`, run `npm start` to start the webpack dev server. Once running, run `npm run electron-dev` to open the app.

React and Redux dev tools will be available inside the Chrome dev tools.

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

