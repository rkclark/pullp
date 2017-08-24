import * as actions from './actions';
import reducer, { initialState } from './reducer';

describe('login reducer', () => {
  it('should return same state when no action matches', () => {
    expect(reducer(initialState, {})).toEqual(initialState);
  });

  describe('Github credentials', () => {
    it('Saves github credentials', () => {
      const credentials = {
        githubClientId: 'test',
        githubClientSecret: 'test',
      };
      const expectedState = {
        ...initialState,
        ...credentials,
      };

      const newState = reducer(
        initialState,
        actions.saveGithubCredentials(credentials),
      );
      expect(newState).toEqual(expectedState);
    });
  });
});
