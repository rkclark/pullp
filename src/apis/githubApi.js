export const queries = {
  currentUser: () =>
    `
query {
	viewer {
    login
    avatarUrl
  }
}
`,
  watchedRepos: (cursor = '') => {
    const afterParam = cursor ? `, after:"${cursor}"` : '';
    return `
          query { 
            viewer { 
              watching(first:100, affiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]${afterParam}) {
                totalCount
                pageInfo {
                  hasNextPage
                }
                edges {
                  cursor
                  node {
                    name
                    id
                    url
                  }
                }
              }
            }
          }`;
  },
  pullRequests: ids =>
    `
        query {
          nodes (ids:${JSON.stringify(ids)}) {
            id
            ... on Repository {
              name
              pullRequests(last: 100 states: [OPEN] orderBy:{ field: CREATED_AT, direction: DESC }) {
                edges {
                  node {
                    createdAt
                    closed
                    mergedAt
                    url
                    number
                    title
                    author {
                      avatarUrl
                      login
                      url
                    }
                    participants(last: 100) {
                      edges {
                        node {
                          login
                          avatarUrl
                          url
                        }
                      }
                    }
                    reviewRequests(last: 100) {
                      edges {
                        node {
                          reviewer {
                            login
                            avatarUrl
                          }
                        }
                      }
                    }
                    reviews(last: 100) {
                      edges {
                        node {
                          author {
                            login
                            avatarUrl
                          }
                          createdAt
                          state
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        `,
};

export const get = async (query, token) => {
  const body = {
    query,
  };
  const response = await fetch('https://api.github.com/graphql', {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
      Authorization: `bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (response.ok) {
    const result = await response.json();
    return result.data;
  }

  throw new Error('Github is not ok :(');
};
