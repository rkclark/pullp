export default {
  get: async () => {
    fetch('https://api.github.com/graphql', {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
      },
      body: {
        query: `query {
                repository(owner:"octocat", name:"Hello-World") {
                  issues(last:20, states:CLOSED) {
                    edges {
                      node {
                        title
                        url
                        labels(first:5) {
                          edges {
                            node {
                              name
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }`,
      },
    });
  },
};
