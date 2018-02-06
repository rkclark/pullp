export const queries = {
  currentUser: () =>
    `
query {
	viewer {
    login
    avatarUrl
    url
  }
}
`,
  userTeams: userLogin =>
    `
query {
  viewer {
    organizations(last:100) {
      edges {
        node {
          teams(last:100, userLogins: ["${userLogin}"]) {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    }
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
                    owner {
                      login
                      avatarUrl
                    }
                    isFork
                    createdAt
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
              url
              pullRequests(last: 100 states: [OPEN] orderBy:{ field: CREATED_AT, direction: DESC }) {
                edges {
                  node {
                    createdAt
                    url
                    number
                    title
                    author {
                      avatarUrl
                      login
                      url
                    }
                    comments(last: 100) {
                      totalCount
                    }
                    reviewRequests(last: 100) {
                      edges {
                        node {
                          requestedReviewer {
                            ... on User {
                              login
                            }
                            ... on Team {
                              name
                              id
                            }
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
    if (result.data) {
      return result.data;
    }
    if (result.errors) {
      if (result.errors[0].type === 'MAX_NODE_LIMIT_EXCEEDED') {
        throw new Error(
          `The amount of pull request data for your selected repositories exceeds Github's maximum limit. Try selecting fewer repositories and trying again. Here is the specific error from Github as guidance: ${result
            .errors[0].message}`,
        );
      }
      throw new Error(result.errors[0].message);
    }
  }

  throw new Error('Error communicating with Github');
};
