import * as actions from './actions';
import { clearPersistedLocalStorage } from '../Account/actions';
import reducer, { initialState } from './reducer';
import { rehydrationComplete } from '../../components/Layout/actions';

describe('Home reducer', () => {
  it('should return same state when no action matches', () => {
    expect(reducer(initialState, {})).toEqual(initialState);
  });

  describe('currentUser', () => {
    it('Saves currentUser data', () => {
      const data = {
        viewer: {
          login: 'login',
          avatarUrl: 'test.com',
          url: 'profile.com',
        },
      };
      const baseState = {
        ...initialState,
        githubCurrentUserError: 'error',
        currentUserLoading: true,
      };

      const expectedState = {
        ...initialState,
        currentUser: {
          login: data.viewer.login,
          avatarUrl: data.viewer.avatarUrl,
          url: data.viewer.url,
        },
        githubCurrentUserError: null,
        currentUserLoading: false,
      };

      const newState = reducer(
        baseState,
        actions.requestCurrentUserSuccess(data),
      );
      expect(newState).toEqual(expectedState);
    });
  });
  describe('Request currentUser failure', () => {
    it('Saves github failure error', () => {
      const baseState = {
        ...initialState,
        currentUserLoading: true,
      };

      const error = 'error';
      const expectedState = {
        ...initialState,
        githubCurrentUserError: error,
        currentUserLoading: false,
      };

      const newState = reducer(
        baseState,
        actions.requestCurrentUserFail(error),
      );
      expect(newState).toEqual(expectedState);
    });
  });
  describe('Request currentUser loading', () => {
    it('Sets loading state to true', () => {
      const expectedState = {
        ...initialState,
        currentUserLoading: true,
      };

      const newState = reducer(
        initialState,
        actions.requestCurrentUserLoading(),
      );
      expect(newState).toEqual(expectedState);
    });
  });

  describe('Toggle open repo', () => {
    const repoId = 'test';

    describe('when a different ID is passed', () => {
      it('sets openRepoId to the correct ID', () => {
        const expectedState = {
          ...initialState,
          openRepoId: repoId,
        };

        const newState = reducer(initialState, actions.toggleOpenRepo(repoId));
        expect(newState.openRepoId).toBe(expectedState.openRepoId);
      });
    });

    describe('when the same ID is passed', () => {
      it('removes the openRepoId ID', () => {
        const newState = reducer(
          { ...initialState, openRepoId: repoId },
          actions.toggleOpenRepo(repoId),
        );
        expect(newState.openRepoId).toBe(null);
      });
    });

    describe('when an undefined ID is passed', () => {
      it('removes the openRepoId ID', () => {
        const newState = reducer(
          { ...initialState, openRepoId: repoId },
          actions.toggleOpenRepo(undefined),
        );
        expect(newState.openRepoId).toBe(null);
      });
    });
  });
  describe('clear persisted local storage', () => {
    it('returns to initial state', () => {
      const baseState = {
        test: true,
      };
      const expectedState = {
        ...initialState,
      };

      const newState = reducer(baseState, clearPersistedLocalStorage());
      expect(newState).toEqual(expectedState);
    });
  });
  describe('request user teams', () => {
    describe('request user teams success', () => {
      it('saves user teams data', () => {
        const baseState = {
          ...initialState,
          githubUserTeamsError: 'error',
        };

        const data = {
          viewer: {
            organizations: {
              edges: [
                {
                  node: {
                    teams: {
                      edges: [
                        {
                          node: {
                            id: 'MDQ6VGVhbTQ0MTgyMA==',
                            name: 'Team: Money',
                          },
                        },
                      ],
                    },
                  },
                },
                {
                  node: {
                    teams: {
                      edges: [
                        {
                          node: {
                            id: 'MDQ6VGVhbTIwNTY1OTc=',
                            name: 'January 2017 Cohort',
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        };

        const expectedState = {
          ...initialState,
          githubUserTeamsError: null,
          userTeams: [
            {
              id: 'MDQ6VGVhbTQ0MTgyMA==',
              name: 'Team: Money',
            },
            {
              id: 'MDQ6VGVhbTIwNTY1OTc=',
              name: 'January 2017 Cohort',
            },
          ],
        };

        expect(
          reducer(baseState, actions.requestUserTeamsSuccess(data)),
        ).toEqual(expectedState);
      });
    });
    describe('request user teams fail', () => {
      it('saves github error', () => {
        const error = 'error';
        const expectedState = {
          ...initialState,
          githubUserTeamsError: error,
        };

        const newState = reducer(
          initialState,
          actions.requestUserTeamsFail(error),
        );
        expect(newState).toEqual(expectedState);
      });
    });
  });

  describe('rehydration complete', () => {
    it('sets state of openRepoId to null', () => {
      const baseState = { ...initialState, openRepoId: 'test' };
      const newState = reducer(baseState, rehydrationComplete());
      expect(newState.openRepoId).toBe(null);
    });
  });
});
