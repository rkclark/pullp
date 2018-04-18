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

If you are using Pullp within an organisation that has private repositories, you should create one set of oAuth credentials and share them. This way, your Github administrator will only need to approve one oAuth application to access the organisation. If you are an individual or you only require access to public repositories, you can make your own credentials.

#### How to make the credentials

- In Github, go to your settings
- Go to Developer Settings, select oAuth Apps (usually selected by default)
- Click New oAuth App
- Give the app a name, this will be seen when/if your app requests access to any organisations that you are a part of
- Set the homepage to whatever you like
- The authorization callback URL is not actually used by Pullp, I'd suggest just setting it to `http://localhost:3001/auth/github/callback`
- Click to register the app
- Make a note of the client ID and client secret that you are shown on the next screen
