import * as actions from './actions';
import { logout } from '../Account/actions';
import reducer, { initialState } from './reducer';

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
      const expectedState = {
        ...initialState,
        currentUser: {
          login: data.viewer.login,
          avatarUrl: data.viewer.avatarUrl,
          url: data.viewer.url,
        },
      };

      const newState = reducer(
        initialState,
        actions.requestCurrentUserSuccess(data),
      );
      expect(newState).toEqual(expectedState);
    });
  });
  describe('Request currentUser failure', () => {
    it('Saves github failure error', () => {
      const error = 'error';
      const expectedState = {
        ...initialState,
        githubError: error,
      };

      const newState = reducer(
        initialState,
        actions.requestCurrentUserFail(error),
      );
      expect(newState).toEqual(expectedState);
    });
  });
  describe('Pull requests', () => {
    const prCreatedAt = '2016-10-15T10:39:37Z';
    const prDateObj = new Date('2016-10-15T10:39:37Z');
    const prDate = prDateObj.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const prTime = prDateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    });
    const data = {
      nodes: [
        {
          id: 'MDEwOlJlcG9zaXRvcnk3MDk0NTE5Ng==',
          name: 'Atticus_Legal',
          pullRequests: {
            edges: [
              {
                node: {
                  createdAt: prCreatedAt,
                  closed: true,
                  mergedAt: '2016-10-15T10:39:44Z',
                  url: 'https://github.com/jh2633/Atticus_Legal/pull/1',
                  number: 1,
                  title: 'Design2',
                  author: {
                    avatarUrl:
                      'https://avatars0.githubusercontent.com/u/18387550?v=4',
                    login: 'jh2633',
                    url: 'https://github.com/jh2633',
                  },
                  comments: {
                    totalCount: 0,
                  },
                  reviewRequests: {
                    edges: [
                      {
                        node: {
                          requestedReviewer: {
                            login: 'testUser',
                          },
                        },
                      },
                    ],
                  },
                  reviews: {
                    edges: [
                      {
                        node: {
                          author: {
                            login: 'testUser',
                            avatarUrl: 'url',
                          },
                          createdAt: '2017-10-05T10:07:18Z',
                          state: 'COMMENTED',
                        },
                      },
                      {
                        node: {
                          author: {
                            login: 'person',
                            avatarUrl: 'url',
                          },
                          createdAt: '2017-10-05T10:07:18Z',
                          state: 'COMMENTED',
                        },
                      },
                      {
                        node: {
                          author: {
                            login: 'person',
                            avatarUrl: 'url',
                          },
                          createdAt: '2017-10-05T10:07:18Z',
                          state: 'APPROVED',
                        },
                      },
                      {
                        node: {
                          author: {
                            login: 'person',
                            avatarUrl: 'url',
                          },
                          createdAt: '2017-10-05T10:07:18Z',
                          state: 'APPROVED',
                        },
                      },
                    ],
                  },
                },
              },
              {
                node: {
                  createdAt: prCreatedAt,
                  closed: false,
                  mergedAt: null,
                  url: 'https://github.com/jh2633/Atticus_Legal/pull/2',
                  number: 2,
                  title:
                    'footer changed on all pages, new forms pages added but in dev, index …',
                  author: {
                    avatarUrl:
                      'https://avatars0.githubusercontent.com/u/18387550?v=4',
                    login: 'jh2633',
                    url: 'https://github.com/jh2633',
                  },
                  comments: {
                    totalCount: 1,
                  },
                  reviewRequests: {
                    edges: [
                      {
                        node: {
                          requestedReviewer: {
                            login: 'wrongUser',
                          },
                        },
                      },
                      {
                        node: {
                          requestedReviewer: {
                            team: 'wrongTeam',
                            id: '2',
                          },
                        },
                      },
                    ],
                  },
                  reviews: {
                    edges: [
                      {
                        node: {
                          author: {
                            login: 'person',
                            avatarUrl: 'url',
                          },
                          createdAt: '2017-10-05T10:07:18Z',
                          state: 'COMMENTED',
                        },
                      },
                    ],
                  },
                },
              },
              {
                node: {
                  createdAt: prCreatedAt,
                  closed: false,
                  mergedAt: null,
                  url: 'https://github.com/jh2633/Atticus_Legal/pull/2',
                  number: 3,
                  title:
                    'footer changed on all pages, new forms pages added but in dev, index …',
                  author: {
                    avatarUrl:
                      'https://avatars0.githubusercontent.com/u/18387550?v=4',
                    login: 'jh2633',
                    url: 'https://github.com/jh2633',
                  },
                  comments: {
                    totalCount: 2,
                  },
                  reviewRequests: {
                    edges: [
                      {
                        node: {
                          requestedReviewer: {
                            team: 'testTeam',
                            id: '1',
                          },
                        },
                      },
                    ],
                  },
                  reviews: {
                    edges: [],
                  },
                },
              },
            ],
          },
        },
        {
          id: 'MDEwOlJlcG9zaXRvcnk3Mjc1NzkxNg==',
          name: 'minesweeper',
          pullRequests: {
            edges: [],
          },
        },
      ],
    };

    const baseState = {
      ...initialState,
      currentUser: {
        login: 'testUser',
      },
      userTeams: [{ name: 'testTeam', id: '1' }],
    };

    const expectedState = {
      ...baseState,
      pullRequestsLoading: false,
      repositories: [
        {
          id: 'MDEwOlJlcG9zaXRvcnk3MDk0NTE5Ng==',
          name: 'Atticus_Legal',
          pullRequests: [
            {
              createdAt: prCreatedAt,
              closed: true,
              mergedAt: '2016-10-15T10:39:44Z',
              date: prDate,
              time: prTime,
              url: 'https://github.com/jh2633/Atticus_Legal/pull/1',
              number: 1,
              title: 'Design2',
              author: {
                avatarUrl:
                  'https://avatars0.githubusercontent.com/u/18387550?v=4',
                login: 'jh2633',
                url: 'https://github.com/jh2633',
              },
              comments: {
                totalCount: 0,
              },
              reviewRequests: [
                {
                  requestedReviewer: {
                    login: 'testUser',
                  },
                },
              ],
              reviews: [
                {
                  author: {
                    login: 'testUser',
                    avatarUrl: 'url',
                  },
                  createdAt: '2017-10-05T10:07:18Z',
                  state: 'COMMENTED',
                },

                {
                  author: {
                    login: 'person',
                    avatarUrl: 'url',
                  },
                  createdAt: '2017-10-05T10:07:18Z',
                  state: 'COMMENTED',
                },
                {
                  author: {
                    login: 'person',
                    avatarUrl: 'url',
                  },
                  createdAt: '2017-10-05T10:07:18Z',
                  state: 'APPROVED',
                },
                {
                  author: {
                    login: 'person',
                    avatarUrl: 'url',
                  },
                  createdAt: '2017-10-05T10:07:18Z',
                  state: 'APPROVED',
                },
              ],
              aggregatedReviews: {
                COMMENTED: 2,
                APPROVED: 2,
              },
              currentUserReviewRequested: false,
              reviewedByCurrentUser: true,
              reviewsByAuthor: [
                { login: 'testUser', avatarUrl: 'url', states: ['COMMENTED'] },
                {
                  login: 'person',
                  avatarUrl: 'url',
                  states: ['COMMENTED', 'APPROVED', 'APPROVED'],
                },
              ],
            },
            {
              createdAt: prCreatedAt,
              date: prDate,
              time: prTime,
              closed: false,
              mergedAt: null,
              url: 'https://github.com/jh2633/Atticus_Legal/pull/2',
              number: 2,
              title:
                'footer changed on all pages, new forms pages added but in dev, index …',
              author: {
                avatarUrl:
                  'https://avatars0.githubusercontent.com/u/18387550?v=4',
                login: 'jh2633',
                url: 'https://github.com/jh2633',
              },
              comments: {
                totalCount: 1,
              },
              reviewRequests: [
                {
                  requestedReviewer: {
                    login: 'wrongUser',
                  },
                },
                {
                  requestedReviewer: {
                    team: 'wrongTeam',
                    id: '2',
                  },
                },
              ],
              reviews: [
                {
                  author: {
                    login: 'person',
                    avatarUrl: 'url',
                  },
                  createdAt: '2017-10-05T10:07:18Z',
                  state: 'COMMENTED',
                },
              ],
              aggregatedReviews: { COMMENTED: 1 },
              currentUserReviewRequested: false,
              reviewedByCurrentUser: false,
              reviewsByAuthor: [
                { login: 'person', avatarUrl: 'url', states: ['COMMENTED'] },
              ],
            },
            {
              createdAt: prCreatedAt,
              date: prDate,
              time: prTime,
              closed: false,
              mergedAt: null,
              url: 'https://github.com/jh2633/Atticus_Legal/pull/2',
              number: 3,
              title:
                'footer changed on all pages, new forms pages added but in dev, index …',
              author: {
                avatarUrl:
                  'https://avatars0.githubusercontent.com/u/18387550?v=4',
                login: 'jh2633',
                url: 'https://github.com/jh2633',
              },
              comments: {
                totalCount: 2,
              },
              reviewRequests: [
                {
                  requestedReviewer: {
                    team: 'testTeam',
                    id: '1',
                  },
                },
              ],
              reviews: [],
              aggregatedReviews: {},
              currentUserReviewRequested: true,
              reviewedByCurrentUser: false,
              reviewsByAuthor: [],
            },
          ],
          currentUserReviewRequests: 1,
          currentUserReviews: 1,
        },
        {
          id: 'MDEwOlJlcG9zaXRvcnk3Mjc1NzkxNg==',
          name: 'minesweeper',
          pullRequests: [],
          currentUserReviewRequests: 0,
          currentUserReviews: 0,
        },
      ],
    };
    it('saves pull request data', () => {
      const newState = reducer(
        { ...baseState, pullRequestsLoading: true },
        actions.requestPullRequestsSuccess(data),
      );
      expect(newState).toEqual(expectedState);
    });
    describe('when github response includes a null for not found repo', () => {
      it('successfully saves pull request data', () => {
        const actionResult = actions.requestPullRequestsSuccess(data);
        actionResult.data.nodes = [...actionResult.data.nodes, null];
        const newState = reducer(baseState, actionResult);
        expect(newState).toEqual(expectedState);
      });
    });
  });
  describe('Request pull requests failure', () => {
    it('Saves github failure error', () => {
      const error = 'error';
      const expectedState = {
        ...initialState,
        githubError: error,
        pullRequestsLoading: false,
      };

      const newState = reducer(
        { ...initialState, pullRequestsLoading: true },
        actions.requestPullRequestsFail(error),
      );
      expect(newState).toEqual(expectedState);
    });
  });

  describe('Pull requests loading', () => {
    it('sets loading status to true', () => {
      const expectedState = {
        ...initialState,
        pullRequestsLoading: true,
      };

      const newState = reducer(
        initialState,
        actions.requestPullRequestsLoading(),
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
  describe('request user teams', () => {
    describe('request user teams success', () => {
      it('saves user teams data', () => {
        const baseState = {
          ...initialState,
          githubError: 'error',
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
          githubError: null,
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
          githubError: error,
        };

        const newState = reducer(
          initialState,
          actions.requestUserTeamsFail(error),
        );
        expect(newState).toEqual(expectedState);
      });
    });
  });
});
