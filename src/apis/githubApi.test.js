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
  }
}
`;
        expect(queries.currentUser()).toEqual(expectedQuery);
      });
    });

    describe('get', () => {
      describe('when fetch returns 200 OK response', () => {
        let testResponse;
        let matcher;
        beforeEach(() => {
          testResponse = { test: 'yay' };
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
          expect(result).toEqual(testResponse);
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
