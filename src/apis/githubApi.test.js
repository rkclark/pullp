import { queries } from './githubApi';

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
  });
});
