import * as actions from './actions';
import { logout } from '../Account/actions';
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

    it('Saves watchedRepos data', () => {
      const baseState = {
        ...initialState,
        githubError: 'error',
        loading: true,
      };

      const expectedState = {
        ...baseState,
        watchedRepos: data,
        githubError: null,
        loading: false,
      };

      const newState = reducer(
        baseState,
        actions.requestWatchedReposSuccess(data),
      );
      expect(newState).toEqual(expectedState);
    });
    describe('when watched repos does not return a repo that is in selected repos', () => {
      it('removes the lost repo from the selectedRepos', () => {
        const baseState = {
          ...initialState,
          githubError: 'error',
          selectedRepos: ['MDEwOlJlcG9zaXRvcnk3MDk0NTE5Ng==', 'lostRepo'],
        };
        const expectedState = {
          ...baseState,
          watchedRepos: data,
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
  describe('pagination', () => {
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
      it('Saves filteredRepos data in pages of 2', () => {
        const baseState = {
          ...initialState,
          reposPerPage: 2,
          filteredRepos: data,
        };

        const expectedState = {
          ...baseState,
          filteredRepos: data,
          reposPerPage: initialState.reposPerPage,
          paginatedRepos: {
            currentPage: 1,
            hasNextPage: true,
            hasPreviousPage: false,
            totalPages: 3,
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
        };

        const newState = reducer(baseState, actions.paginateRepos());
        expect(newState).toEqual(expectedState);
      });
    });
    describe('when reposPerPage === 4', () => {
      it('Saves filteredRepos data in pages of 4', () => {
        const baseState = {
          ...initialState,
          reposPerPage: 4,
          filteredRepos: data,
        };

        const expectedState = {
          ...baseState,
          filteredRepos: data,
          reposPerPage: initialState.reposPerPage,
          paginatedRepos: {
            currentPage: 1,
            hasNextPage: true,
            hasPreviousPage: false,
            totalPages: 2,
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
        };
        const newState = reducer(baseState, actions.paginateRepos());
        expect(newState).toEqual(expectedState);
      });
    });
    describe('when there is only one page of results', () => {
      it('sets hasNextPage to false', () => {
        const baseState = {
          ...initialState,
          reposPerPage: 50,
          filteredRepos: data,
        };

        const expectedState = {
          ...baseState,
          filteredRepos: data,
          reposPerPage: initialState.reposPerPage,
          paginatedRepos: {
            currentPage: 1,
            hasNextPage: false,
            hasPreviousPage: false,
            totalPages: 1,
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

        const newState = reducer(baseState, actions.paginateRepos());
        expect(newState).toEqual(expectedState);
      });
    });
    describe('when there are no results', () => {
      it('sets hasNextPage to false', () => {
        const baseState = {
          ...initialState,
          reposPerPage: 50,
          filteredRepos: [],
        };

        const expectedState = {
          ...baseState,
          reposPerPage: initialState.reposPerPage,
          filteredRepos: [],
          paginatedRepos: {
            currentPage: null,
            hasNextPage: false,
            hasPreviousPage: false,
            totalPages: 0,
            pages: {},
          },
        };

        const newState = reducer(baseState, actions.paginateRepos());
        expect(newState).toEqual(expectedState);
      });
    });
  });
  describe('change repos page', () => {
    const testPages = {
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
    };
    it('changes the current page', () => {
      const baseState = {
        ...initialState,
      };

      const expectedState = {
        ...baseState,
        paginatedRepos: {
          ...baseState.paginatedRepos,
          currentPage: 4,
          hasNextPage: false,
          hasPreviousPage: true,
        },
        githubError: null,
      };

      const newState = reducer(baseState, actions.changeReposPage(4));
      expect(newState).toEqual(expectedState);
    });
    describe('when the new page is not the last or the first', () => {
      it('sets hasNextPage and has previousPage to true', () => {
        const baseState = {
          ...initialState,
          paginatedRepos: {
            currentPage: 3,
            hasNextPage: false,
            hasPreviousPage: false,
            totalPages: 3,
            pages: testPages,
          },
        };
        const expectedState = {
          ...baseState,
          paginatedRepos: {
            ...baseState.paginatedRepos,
            currentPage: 2,
            hasNextPage: true,
            hasPreviousPage: true,
          },
        };

        const newState = reducer(baseState, actions.changeReposPage(2));
        expect(newState).toEqual(expectedState);
      });
    });
    describe('when the new page is the last', () => {
      it('sets hasNextPage to false', () => {
        const baseState = {
          ...initialState,
          paginatedRepos: {
            currentPage: 2,
            hasNextPage: true,
            hasPreviousPage: true,
            totalPages: 3,
            pages: testPages,
          },
        };
        const expectedState = {
          ...baseState,
          paginatedRepos: {
            ...baseState.paginatedRepos,
            currentPage: 3,
            hasNextPage: false,
            hasPreviousPage: true,
          },
        };

        const newState = reducer(baseState, actions.changeReposPage(3));
        expect(newState).toEqual(expectedState);
      });
    });
    describe('when the new page is the first', () => {
      it('sets hasPreviousPage to false', () => {
        const baseState = {
          ...initialState,
          paginatedRepos: {
            currentPage: 2,
            hasNextPage: true,
            hasPreviousPage: true,
            totalPages: 3,
            pages: testPages,
          },
        };
        const expectedState = {
          ...baseState,
          paginatedRepos: {
            ...baseState.paginatedRepos,
            currentPage: 1,
            hasNextPage: true,
            hasPreviousPage: false,
          },
        };

        const newState = reducer(baseState, actions.changeReposPage(1));
        expect(newState).toEqual(expectedState);
      });
    });
  });
  describe('Request watchedRepos failure', () => {
    it('Saves github failure error', () => {
      const error = 'error';
      const baseState = {
        ...initialState,
        loading: true,
      };
      const expectedState = {
        ...initialState,
        githubError: error,
        loading: false,
      };

      const newState = reducer(
        baseState,
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
    it('saves lowercased repo filter value to state', () => {
      const filterValue = 'Value';
      const baseState = {
        ...initialState,
      };
      const expectedState = {
        ...initialState,
        repoFilterValue: filterValue.toLowerCase(),
      };
      const newState = reducer(
        baseState,
        actions.saveRepoFilterValue(filterValue),
      );
      expect(newState).toEqual(expectedState);
    });
  });
  describe('filterRepos', () => {
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
          name: 'foo3',
          id: 'testid1==',
        },
        {
          name: 'Foo4',
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

    it('filters watchedRepos into filteredRepos array based on case insensitive search', () => {
      const filterValue = 'foo';
      const baseState = {
        ...initialState,
        watchedRepos: data,
        repoFilterValue: filterValue,
      };
      const expectedState = {
        ...initialState,
        watchedRepos: data,
        repoFilterValue: filterValue,
        filteredRepos: [
          {
            name: 'foo3',
            id: 'testid1==',
          },
          {
            name: 'Foo4',
            id: 'testid2==',
          },
        ],
      };
      const newState = reducer(baseState, actions.filterRepos());
      expect(newState).toEqual(expectedState);
    });
    describe('when repoFilterValue is empty', () => {
      it('does not filter out any repos', () => {
        const filterValue = '';
        const baseState = {
          ...initialState,
          watchedRepos: data,
          repoFilterValue: filterValue,
        };
        const expectedState = {
          ...initialState,
          watchedRepos: data,
          repoFilterValue: filterValue,
          filteredRepos: data,
        };
        const newState = reducer(baseState, actions.filterRepos());
        expect(newState).toEqual(expectedState);
      });
    });
    describe('when repoFilterValue is null', () => {
      it('does not filter out any repos', () => {
        const filterValue = null;
        const baseState = {
          ...initialState,
          watchedRepos: data,
          repoFilterValue: filterValue,
        };
        const expectedState = {
          ...initialState,
          watchedRepos: data,
          repoFilterValue: filterValue,
          filteredRepos: data,
        };
        const newState = reducer(baseState, actions.filterRepos());
        expect(newState).toEqual(expectedState);
      });
    });
  });
  describe('logout', () => {
    it('returns to initial state', () => {
      const baseState = {
        test: true,
      };
      const expectedState = {
        ...initialState,
      };

      const newState = reducer(baseState, logout());
      expect(newState).toEqual(expectedState);
    });
  });
  describe('loading', () => {
    it('sets loading to true and githubError to null', () => {
      const baseState = {
        ...initialState,
        loading: false,
        githubError: 'error',
      };

      const expectedState = {
        ...initialState,
        loading: true,
        githubError: null,
      };

      const newState = reducer(baseState, actions.loadingWatchedRepos());
      expect(newState).toEqual(expectedState);
    });
  });
});
