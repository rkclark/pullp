import * as actions from './actions';
import reducer, { initialState } from './reducer';

describe('SelectRepos reducer', () => {
  it('should return same state when no action matches', () => {
    expect(reducer(initialState, {})).toEqual(initialState);
  });

  describe('watchedRepos', () => {
    let data;

    beforeEach(() => {
      data = [
        {
          name: 'test1',
          id: 'MDEwOlJlcG9zaXRvcnk3MDk0NTE5Ng==',
        },
        {
          name: 'test2',
          id: 'MDEwOlJlcG9zaXRvcnk3Mjc1NzkxNg==',
        },
        {
          name: 'test3',
          id: 'testid1==',
        },
        {
          name: 'test4',
          id: 'testid2==',
        },
        {
          name: 'test5',
          id: 'MDEwOlJlcG9zaXRvcnk3MDk0NTE5Ng==',
        },
        {
          name: 'test6',
          id: 'MDEwOlJlcG9zaXRvcnk3Mjc1NzkxNg==',
        },
      ];
    });
    describe('when reposPerPage === 2', () => {
      it('Saves watchedRepos data in pages of 2', () => {
        const baseState = {
          ...initialState,
          githubError: 'error',
          reposPerPage: 2,
        };

        const expectedState = {
          ...baseState,
          watchedRepos: {
            currentPage: 1,
            hasNextPage: true,
            hasPreviousPage: false,
            pages: {
              1: [
                {
                  name: 'test1',
                  id: 'MDEwOlJlcG9zaXRvcnk3MDk0NTE5Ng==',
                },
                {
                  name: 'test2',
                  id: 'MDEwOlJlcG9zaXRvcnk3Mjc1NzkxNg==',
                },
              ],
              2: [
                {
                  name: 'test3',
                  id: 'testid1==',
                },
                {
                  name: 'test4',
                  id: 'testid2==',
                },
              ],
              3: [
                {
                  name: 'test5',
                  id: 'MDEwOlJlcG9zaXRvcnk3MDk0NTE5Ng==',
                },
                {
                  name: 'test6',
                  id: 'MDEwOlJlcG9zaXRvcnk3Mjc1NzkxNg==',
                },
              ],
            },
          },
          githubError: null,
        };

        const newState = reducer(
          baseState,
          actions.requestWatchedReposSuccess(data),
        );
        expect(newState).toEqual(expectedState);
      });
    });
    describe('when reposPerPage === 4', () => {
      it('Saves watchedRepos data in pages of 4', () => {
        const baseState = {
          ...initialState,
          githubError: 'error',
          reposPerPage: 4,
        };

        const expectedState = {
          ...baseState,
          watchedRepos: {
            currentPage: 1,
            hasNextPage: true,
            hasPreviousPage: false,
            pages: {
              1: [
                {
                  name: 'test1',
                  id: 'MDEwOlJlcG9zaXRvcnk3MDk0NTE5Ng==',
                },
                {
                  name: 'test2',
                  id: 'MDEwOlJlcG9zaXRvcnk3Mjc1NzkxNg==',
                },
                {
                  name: 'test3',
                  id: 'testid1==',
                },
                {
                  name: 'test4',
                  id: 'testid2==',
                },
              ],
              2: [
                {
                  name: 'test5',
                  id: 'MDEwOlJlcG9zaXRvcnk3MDk0NTE5Ng==',
                },
                {
                  name: 'test6',
                  id: 'MDEwOlJlcG9zaXRvcnk3Mjc1NzkxNg==',
                },
              ],
            },
          },
          githubError: null,
        };
        const newState = reducer(
          baseState,
          actions.requestWatchedReposSuccess(data),
        );
        expect(newState).toEqual(expectedState);
      });
    });
    describe('when there is only one page of results', () => {
      it('sets hasNextPage to false', () => {
        const baseState = {
          ...initialState,
          githubError: 'error',
          reposPerPage: 50,
        };

        const expectedState = {
          ...baseState,
          watchedRepos: {
            currentPage: 1,
            hasNextPage: false,
            hasPreviousPage: false,
            pages: {
              1: [
                {
                  name: 'test1',
                  id: 'MDEwOlJlcG9zaXRvcnk3MDk0NTE5Ng==',
                },
                {
                  name: 'test2',
                  id: 'MDEwOlJlcG9zaXRvcnk3Mjc1NzkxNg==',
                },
                {
                  name: 'test3',
                  id: 'testid1==',
                },
                {
                  name: 'test4',
                  id: 'testid2==',
                },
                {
                  name: 'test5',
                  id: 'MDEwOlJlcG9zaXRvcnk3MDk0NTE5Ng==',
                },
                {
                  name: 'test6',
                  id: 'MDEwOlJlcG9zaXRvcnk3Mjc1NzkxNg==',
                },
              ],
            },
          },
          githubError: null,
        };

        const newState = reducer(
          baseState,
          actions.requestWatchedReposSuccess(data),
        );
        expect(newState).toEqual(expectedState);
      });
    });
    describe('when there are no results', () => {
      it('sets hasNextPage to false', () => {
        const baseState = {
          ...initialState,
          githubError: 'error',
          reposPerPage: 50,
        };

        const expectedState = {
          ...baseState,
          watchedRepos: {
            currentPage: 1,
            hasNextPage: false,
            hasPreviousPage: false,
            pages: {},
          },
          githubError: null,
        };

        const newState = reducer(
          baseState,
          actions.requestWatchedReposSuccess([]),
        );
        expect(newState).toEqual(expectedState);
      });
    });
    describe('when watched repos does not return a repo that is in selected repos', () => {
      it('removes the lost repo from the selectedRepos', () => {
        const baseState = {
          ...initialState,
          githubError: 'error',
          reposPerPage: 50,
          selectedRepos: ['MDEwOlJlcG9zaXRvcnk3MDk0NTE5Ng==', 'lostRepo'],
        };
        const expectedState = {
          ...baseState,
          watchedRepos: {
            currentPage: 1,
            hasNextPage: false,
            hasPreviousPage: false,
            pages: {
              1: [
                {
                  name: 'test1',
                  id: 'MDEwOlJlcG9zaXRvcnk3MDk0NTE5Ng==',
                },
                {
                  name: 'test2',
                  id: 'MDEwOlJlcG9zaXRvcnk3Mjc1NzkxNg==',
                },
                {
                  name: 'test3',
                  id: 'testid1==',
                },
                {
                  name: 'test4',
                  id: 'testid2==',
                },
                {
                  name: 'test5',
                  id: 'MDEwOlJlcG9zaXRvcnk3MDk0NTE5Ng==',
                },
                {
                  name: 'test6',
                  id: 'MDEwOlJlcG9zaXRvcnk3Mjc1NzkxNg==',
                },
              ],
            },
          },
          githubError: null,
          selectedRepos: ['MDEwOlJlcG9zaXRvcnk3MDk0NTE5Ng=='],
        };
        const newState = reducer(
          baseState,
          actions.requestWatchedReposSuccess(data),
        );
        expect(newState).toEqual(expectedState);
      });
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
  describe('repoFilterValue', () => {
    it('saves repo filter value to state', () => {
      const filterValue = 'value';
      const baseState = {
        ...initialState,
      };
      const expectedState = {
        ...initialState,
        repoFilterValue: filterValue,
      };
      const newState = reducer(
        baseState,
        actions.saveRepoFilterValue(filterValue),
      );
      expect(newState).toEqual(expectedState);
    });
  });
});
