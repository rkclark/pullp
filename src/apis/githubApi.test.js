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
        const expectedQuery = `
        query {
          nodes (ids:${JSON.stringify(testIds)}) {
            id
            ... on Repository {
              name
              url
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
        `;
        expect(queries.pullRequests(testIds)).toEqual(expectedQuery);
      });
    });

    describe('get', () => {
      describe('when fetch returns 200 OK response', () => {
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
          expect(fetchMock.lastCall(matcher)[1].body).toContain(query);
          expect(fetchMock.lastCall(matcher)[1].headers.Authorization).toEqual(
            `bearer ${token}`,
          );
        });
        it('returns received JSON', async () => {
          const query = '{ query }';
          const token = 'testToken';
          const result = await get(query, token);
          expect(result).toEqual(testResponse.data);
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
