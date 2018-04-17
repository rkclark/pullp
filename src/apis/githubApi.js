import { MAXIMUM_PRS } from '../constants';

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
          rateLimit {
            limit
            cost
            remaining
            resetAt
          }
          nodes (ids:${JSON.stringify(ids)}) {
            id
            ... on Repository {
              pullRequests(last: ${MAXIMUM_PRS} states: [OPEN] orderBy:{ field: CREATED_AT, direction: DESC }) {
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
  console.log(query);
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
    if (result.errors) {
      console.error(result.errors); // eslint-disable-line no-console
      if (result.errors[0].type === 'MAX_NODE_LIMIT_EXCEEDED') {
        throw new Error(
          `The amount of pull request data for your selected repositories exceeds Github's maximum limit. Try selecting fewer repositories and trying again. Here is the specific error from Github as guidance: ${
            result.errors[0].message
          }`,
        );
      }
      throw new Error(result.errors[0].message);
    }
    if (result.data) {
      console.log(result);
      return result.data;
    }
  }

  throw new Error('Error communicating with Github');
};
