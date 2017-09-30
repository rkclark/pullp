import * as actions from './actions';
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
    const prDate = prDateObj.toLocaleDateString();
    const prTime = prDateObj.toLocaleTimeString();
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
                  assignees: {
                    edges: [],
                  },
                  author: {
                    avatarUrl:
                      'https://avatars0.githubusercontent.com/u/18387550?v=4',
                    login: 'jh2633',
                    url: 'https://github.com/jh2633',
                  },
                  participants: {
                    edges: [
                      {
                        node: {
                          login: 'jh2633',
                          avatarUrl:
                            'https://avatars0.githubusercontent.com/u/18387550?v=4',
                          url: 'https://github.com/jh2633',
                        },
                      },
                    ],
                  },
                  reviewRequests: {
                    edges: [
                      {
                        node: {
                          some: 'stuff',
                        },
                      },
                    ],
                  },
                  reviews: {
                    edges: [
                      {
                        node: {
                          some: 'stuff',
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
                  assignees: {
                    edges: [],
                  },
                  author: {
                    avatarUrl:
                      'https://avatars0.githubusercontent.com/u/18387550?v=4',
                    login: 'jh2633',
                    url: 'https://github.com/jh2633',
                  },
                  participants: {
                    edges: [
                      {
                        node: {
                          login: 'jh2633',
                          avatarUrl:
                            'https://avatars0.githubusercontent.com/u/18387550?v=4',
                          url: 'https://github.com/jh2633',
                        },
                      },
                    ],
                  },
                  reviewRequests: {
                    edges: [],
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
    const expectedState = {
      ...initialState,
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
              assignees: [],
              author: {
                avatarUrl:
                  'https://avatars0.githubusercontent.com/u/18387550?v=4',
                login: 'jh2633',
                url: 'https://github.com/jh2633',
              },
              participants: [
                {
                  login: 'jh2633',
                  avatarUrl:
                    'https://avatars0.githubusercontent.com/u/18387550?v=4',
                  url: 'https://github.com/jh2633',
                },
              ],
              reviewRequests: [{ some: 'stuff' }],
              reviews: [{ some: 'stuff' }],
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
              assignees: [],
              author: {
                avatarUrl:
                  'https://avatars0.githubusercontent.com/u/18387550?v=4',
                login: 'jh2633',
                url: 'https://github.com/jh2633',
              },
              participants: [
                {
                  login: 'jh2633',
                  avatarUrl:
                    'https://avatars0.githubusercontent.com/u/18387550?v=4',
                  url: 'https://github.com/jh2633',
                },
              ],
              reviewRequests: [],
              reviews: [],
            },
          ],
        },
        {
          id: 'MDEwOlJlcG9zaXRvcnk3Mjc1NzkxNg==',
          name: 'minesweeper',
          pullRequests: [],
        },
      ],
    };
    it('saves pull request data', () => {
      const newState = reducer(
        initialState,
        actions.requestPullRequestsSuccess(data),
      );
      expect(newState).toEqual(expectedState);
    });
    describe('when github response includes a null for not found repo', () => {
      it('successfully saves pull request data', () => {
        const actionResult = actions.requestPullRequestsSuccess(data);
        actionResult.data.nodes = [...actionResult.data.nodes, null];
        const newState = reducer(initialState, actionResult);
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
      };

      const newState = reducer(
        initialState,
        actions.requestPullRequestsFail(error),
      );
      expect(newState).toEqual(expectedState);
    });
  });
});
