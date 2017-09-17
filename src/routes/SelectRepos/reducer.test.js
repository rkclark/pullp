import * as actions from './actions';
import reducer, { initialState } from './reducer';

describe('SelectRepos reducer', () => {
  it('should return same state when no action matches', () => {
    expect(reducer(initialState, {})).toEqual(initialState);
  });

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
                  url: 'testurl1',
                },
              },
              {
                node: {
                  name: 'Repo2',
                  id: 'gdfdshgfghfgh==',
                  url: 'testurl2',
                },
              },
            ],
          },
        },
      };
      const baseState = {
        ...initialState,
        githubError: 'error',
      };

      const expectedState = {
        ...baseState,
        watchedRepos: [
          {
            name: 'Repo1',
            id: 'hjhgjhjgh==',
            url: 'testurl1',
          },
          {
            name: 'Repo2',
            id: 'gdfdshgfghfgh==',
            url: 'testurl2',
          },
        ],
        githubError: null,
      };

      const newState = reducer(
        baseState,
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
  describe('selectedRepos', () => {
    describe('toggle repo selection', () => {
      describe('when repo is not selected', () => {
        it('adds repo to selectedRepos', () => {
          const id = 'testId';
          const expectedState = {
            ...initialState,
            selectedRepos: [id],
          };
          const newState = reducer(
            initialState,
            actions.toggleRepoSelection(id),
          );
          expect(newState).toEqual(expectedState);
        });
      });
      describe('when repo is already selected', () => {
        it('adds repo to selectedRepos', () => {
          const id = 'testId';
          const baseState = {
            ...initialState,
            selectedRepos: [id],
          };
          const expectedState = {
            ...baseState,
            selectedRepos: [],
          };
          const newState = reducer(baseState, actions.toggleRepoSelection(id));
          expect(newState).toEqual(expectedState);
        });
      });
    });
  });
});
