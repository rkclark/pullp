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
  pullRequests: (ids, maximumPrs) =>
    `
        query {
          nodes (ids:${JSON.stringify(ids)}) {
            id
            ... on Repository {
              pullRequests(last: ${maximumPrs} states: [OPEN] orderBy:{ field: CREATED_AT, direction: DESC }) {
                totalCount
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
                    reviewRequests(last: 100) {
                      edges {
                        node {
                          requestedReviewer {
                            ... on User {
                              login
                              avatarUrl
                            }
                            ... on Team {
                              name
                              id
                              avatarUrl
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
  const response = await fetch(process.env.REACT_APP_GITHUB_API_URL, {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
      Authorization: `bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const result = await response.json();
    if (result.errors) {
      console.error(result.errors); // eslint-disable-line no-console
      throw new Error(result.errors[0].message);
    }
    if (result.data) {
      return result.data;
    }
  }

  throw new Error('Error communicating with Github');
};
