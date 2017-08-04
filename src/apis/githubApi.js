import { REACT_APP_GITHUB_TOKEN } from '../config';

const QUERY = `
query WatchingWithPullRequests {
  user(login: "rkclark") {
    watching(last: 100) {
      nodes {
        name
        pullRequests(last: 100, states: OPEN) {
          nodes {
            url
            reviewRequests(last: 10) {
              nodes {
                reviewer {
                  login
                }
              }
            }
            author {
              login
            }
          }
        }
      }
    }
  }
}
`;

export default {
  get: async () => {
    const body = {
      query: QUERY,
    };

    const response = await fetch('https://api.github.com/graphql', {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
        Authorization: `bearer ${REACT_APP_GITHUB_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const result = await response.json();
      return result.data.user.watching.nodes;
    }

    throw new Error('Github is not ok :(');
  },
};
