import * as actions from './actions';
import reducer, { initialState } from './reducer';

describe('SelectRepos reducer', () => {
  // it('should return same state when no action matches', () => {
  //   expect(reducer(initialState, {})).toEqual(initialState);
  // });

  describe('watchedRepos', () => {
    it('Saves watchedRepos data', () => {
      const data = {
        viewer: {
          watching: {
            totalCount: 2,
            pageInfo: {
              hasNextPage: false,
            },
            edges: [
              {
                node: {
                  name: 'Repo1',
                  id: 'hjhgjhjgh==',
                },
              },
              {
                node: {
                  name: 'Repo2',
                  id: 'gdfdshgfghfgh==',
                },
              },
            ],
          },
        },
      };
      const expectedState = {
        ...initialState,
        watchedRepos: [
          {
            name: 'Repo1',
            id: 'hjhgjhjgh==',
          },
          {
            name: 'Repo2',
            id: 'gdfdshgfghfgh==',
          },
        ],
      };

      const newState = reducer(
        initialState,
        actions.requestWatchedReposSuccess(data),
      );
      expect(newState).toEqual(expectedState);
    });
  });
  describe('Request watchedRepos failure', () => {
    it('Saves github failure error', () => {
      const error = 'error';
      const expectedState = {
        ...initialState,
        githubError: error,
      };

      const newState = reducer(
        initialState,
        actions.requestWatchedReposFail(error),
      );
      expect(newState).toEqual(expectedState);
    });
  });
});
