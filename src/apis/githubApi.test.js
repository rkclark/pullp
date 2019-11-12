import fetchMock from 'fetch-mock';
import { queries, get } from './githubApi';

describe('Github API', () => {
  describe('queries', () => {
    describe('currentUser', () => {
      it('returns correct graphql query', () => {
        const expectedQuery = `
query {
	viewer {
    login
    avatarUrl
    url
  }
}
`;
        expect(queries.currentUser()).toEqual(expectedQuery);
      });
    });

    describe('userTeams', () => {
      it('returns correct graphql query', () => {
        const userLogin = 'test';

        const expectedQuery = `
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
`;
        expect(queries.userTeams(userLogin)).toEqual(expectedQuery);
      });
    });

    describe('watchedRepos', () => {
      describe('when no graphql cursor is supplied', () => {
        it('returns graphql query with no after parameter', () => {
          const expectedQuery = `
          query { 
            viewer { 
              watching(first:100, affiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]) {
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
          expect(queries.watchedRepos()).toEqual(expectedQuery);
        });
      });
      describe('when graphql cursor is supplied', () => {
        it('returns graphql query with correct after parameter', () => {
          const expectedQuery = `
          query { 
            viewer { 
              watching(first:100, affiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER], after:"testCursor") {
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
          expect(queries.watchedRepos('testCursor')).toEqual(expectedQuery);
        });
      });
    });

    describe('pullRequests', () => {
      it('returns correct graphql query', () => {
        const testIds = ['test1', 'test2', 'test3'];
        const maxmimumPrs = 20;
        const expectedQuery = `
        query {
          nodes (ids:${JSON.stringify(testIds)}) {
            id
            ... on Repository {
              pullRequests(last: ${maxmimumPrs} states: [OPEN] orderBy:{ field: CREATED_AT, direction: DESC }) {
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
                    isDraft
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
        `;
        expect(queries.pullRequests(testIds, maxmimumPrs)).toEqual(
          expectedQuery,
        );
      });
    });

    describe('get', () => {
      describe('when fetch returns 200 OK response with valid data', () => {
        let testResponse;
        let matcher;
        beforeEach(() => {
          testResponse = { data: { test: 'yay' } };
          matcher = 'https://api.github.com/graphql';
          fetchMock.mock(matcher, testResponse);
        });

        afterEach(() => {
          fetchMock.restore();
        });
        it('calls github api with supplied query and token', async () => {
          const query = '{ query }';
          const token = 'testToken';
          await get(query, token);
          const [, lastCallOptions] = fetchMock.lastCall(matcher);
          expect(lastCallOptions.body).toContain(query);
          expect(lastCallOptions.headers.Authorization).toEqual(
            `bearer ${token}`,
          );
          expect(lastCallOptions.headers.Accept).toEqual(
            'application/vnd.github.shadow-cat-preview+json',
          );
        });
        it('returns received JSON', async () => {
          const query = '{ query }';
          const token = 'testToken';
          const result = await get(query, token);
          expect(result).toEqual(testResponse.data);
        });
      });

      describe('when result contains errors array', () => {
        let testResponse;
        let matcher;
        const message = 'test error';
        beforeEach(() => {
          testResponse = {
            data: null,
            errors: [{ type: 'TEST', message }],
          };
          matcher = 'https://api.github.com/graphql';
          fetchMock.mock(matcher, testResponse);
        });

        afterEach(() => {
          fetchMock.restore();
        });
        it('returns received error', async () => {
          const query = '{ query }';
          const token = 'testToken';
          let error = '';
          try {
            await get(query, token);
          } catch (err) {
            error = err;
          }
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toEqual(message);
        });
      });

      describe('when fetch returns non 200 response', () => {
        let matcher;
        beforeEach(() => {
          matcher = 'https://api.github.com/graphql';
          fetchMock.mock(matcher, 400);
        });

        afterEach(() => {
          fetchMock.restore();
        });
        it('throws error', async () => {
          const query = '{ query }';
          const token = 'testToken';
          let error = '';
          try {
            await get(query, token);
          } catch (err) {
            error = err;
          }
          expect(error).toBeInstanceOf(Error);
        });
      });
    });
  });
});
