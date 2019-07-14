/* eslint-disable no-console */

export default function ClientActions({ client }) {
  return {
    saveGithubToken: token => {
      console.log('SAVinG GITHUB TOKEN', token);
      client.writeData({
        data: {
          githubAuth: {
            token,
            loadingToken: false,
            __typename: 'GithubAuth',
          },
        },
      });
    },

    setLoadingToken: () => {
      client.writeData({
        data: {
          githubAuth: {
            loadingToken: true,
            error: null,
            __typename: 'GithubAuth',
          },
        },
      });
    },

    saveTokenError: error => {
      client.writeData({
        data: {
          githubAuth: {
            loadingToken: false,
            error,
            __typename: 'GithubAuth',
          },
        },
      });
    },
  };
}
