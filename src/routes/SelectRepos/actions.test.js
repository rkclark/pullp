import sinon from 'sinon';
import { selectRepos as types } from '../../actionTypes';
import * as actions from './actions';
import * as githubApi from '../../apis/githubApi';

describe('SelectRepos actions', () => {
  describe('Retrieving watched repos', () => {
    describe('requestWatchedRepos', () => {
      describe('when call to github succeeds', () => {
        describe('when results do not have a nextPage', () => {
          it('dispatches requestWatchedReposSuccess and paginateRepos actions', async () => {
            const queryMock = sinon.stub(githubApi.queries, 'watchedRepos');
            const testQuery = '{ query }';
            queryMock.returns(testQuery);
            const getMock = sinon.stub(githubApi, 'get');
            const testResult = {
              viewer: {
                watching: {
                  totalCount: 2,
                  pageInfo: {
                    hasNextPage: false,
                  },
                  edges: [
                    {
                      cursor: 'hghghrsfdvs==',
                      node: {
                        name: 'test1',
                        id: 'testid1==',
                        url: 'https://github.com/repo1',
                        owner: {
                          avatarUrl: 'https://avatar1',
                          login: 'user1',
                        },
                        isFork: false,
                        createdAt: '2016-10-14T20:31:44Z',
                      },
                    },
                    {
                      cursor: 'adsatgdgrsgsdf',
                      node: {
                        name: 'test2',
                        id: 'testid2==',
                        url: 'https://github.com/repo2',
                        owner: {
                          avatarUrl: 'https://avatar2',
                          login: 'user2',
                        },
                        isFork: false,
                        createdAt: '2016-10-14T20:31:44Z',
                      },
                    },
                  ],
                },
              },
            };
            const expectedResult = [
              {
                name: 'test1',
                id: 'testid1==',
                url: 'https://github.com/repo1',
                owner: {
                  avatarUrl: 'https://avatar1',
                  login: 'user1',
                },
                isFork: false,
                createdAt: new Date('2016-10-14T20:31:44Z'),
              },
              {
                name: 'test2',
                id: 'testid2==',
                url: 'https://github.com/repo2',
                owner: {
                  avatarUrl: 'https://avatar2',
                  login: 'user2',
                },
                isFork: false,
                createdAt: new Date('2016-10-14T20:31:44Z'),
              },
            ];
            getMock.returns(testResult);
            const requestWatchedRepos = actions.requestWatchedRepos(
              'testToken',
            );
            const dispatch = jest.fn();
            await requestWatchedRepos(dispatch);
            queryMock.restore();
            getMock.restore();
            expect(dispatch.mock.calls[0][0]).toEqual(
              actions.requestWatchedReposSuccess(expectedResult),
            );
            expect(dispatch.mock.calls[1][0]).toEqual(actions.filterRepos());
            expect(dispatch.mock.calls[2][0]).toEqual(actions.paginateRepos());
          });
        });
        describe('when results have a nextPage', () => {
          it('dispatches requestWatchedReposSuccess with the result', async () => {
            const testCursor = 'Y3Vyc29yOnYyOpHOBFYynA==';
            const testToken = 'testToken';
            const queryMock = sinon.stub(githubApi.queries, 'watchedRepos');
            const testQueryOne = '{ query1 }';
            const testQueryTwo = '{ query2 }';
            queryMock.withArgs().returns(testQueryOne);
            queryMock.withArgs(testCursor).returns(testQueryTwo);
            const getMock = sinon.stub(githubApi, 'get');
            const testResult1 = {
              viewer: {
                watching: {
                  totalCount: 68,
                  pageInfo: {
                    hasNextPage: true,
                  },
                  edges: [
                    {
                      cursor: 'Y3Vyc29yOnYyOpHOBDqJrA==',
                      node: {
                        name: 'Atticus_Legal',
                        id: 'MDEwOlJlcG9zaXRvcnk3MDk0NTE5Ng==',
                        createdAt: '2016-10-14T20:31:44Z',
                      },
                    },
                    {
                      cursor: testCursor,
                      node: {
                        name: 'minesweeper',
                        id: 'MDEwOlJlcG9zaXRvcnk3Mjc1NzkxNg==',
                        createdAt: '2016-10-14T20:31:44Z',
                      },
                    },
                  ],
                },
              },
            };
            const testResult2 = {
              viewer: {
                watching: {
                  totalCount: 68,
                  pageInfo: {
                    hasNextPage: false,
                  },
                  edges: [
                    {
                      cursor: 'hghghrsfdvs==',
                      node: {
                        name: 'test1',
                        id: 'testid1==',
                        createdAt: '2016-10-14T20:31:44Z',
                      },
                    },
                    {
                      cursor: 'adsatgdgrsgsdf',
                      node: {
                        name: 'test2',
                        id: 'testid2==',
                        createdAt: '2016-10-14T20:31:44Z',
                      },
                    },
                  ],
                },
              },
            };
            const combinedResult = [
              {
                name: 'Atticus_Legal',
                id: 'MDEwOlJlcG9zaXRvcnk3MDk0NTE5Ng==',
                createdAt: new Date('2016-10-14T20:31:44Z'),
              },
              {
                name: 'minesweeper',
                id: 'MDEwOlJlcG9zaXRvcnk3Mjc1NzkxNg==',
                createdAt: new Date('2016-10-14T20:31:44Z'),
              },
              {
                name: 'test1',
                id: 'testid1==',
                createdAt: new Date('2016-10-14T20:31:44Z'),
              },
              {
                name: 'test2',
                id: 'testid2==',
                createdAt: new Date('2016-10-14T20:31:44Z'),
              },
            ];
            getMock.withArgs(testQueryOne, testToken).returns(testResult1);
            getMock.withArgs(testQueryTwo, testToken).returns(testResult2);
            const requestWatchedRepos = actions.requestWatchedRepos(testToken);
            const dispatch = jest.fn();
            await requestWatchedRepos(dispatch);
            queryMock.restore();
            getMock.restore();
            expect(dispatch).toHaveBeenCalledWith(
              actions.requestWatchedReposSuccess(combinedResult),
            );
          });
        });
      });
      describe('when call to github fails', () => {
        it('dispatches requestWatchedReposFail with the error message', async () => {
          const queryMock = sinon.stub(githubApi.queries, 'watchedRepos');
          const testQuery = '{ query }';
          queryMock.returns(testQuery);
          const getMock = sinon.stub(githubApi, 'get');
          const testError = new Error('Omfg');
          getMock.throws(testError);
          const requestWatchedRepos = actions.requestWatchedRepos('testToken');
          const dispatch = jest.fn();
          await requestWatchedRepos(dispatch);
          queryMock.restore();
          getMock.restore();
          expect(dispatch).toHaveBeenCalledWith(
            actions.requestWatchedReposFail(testError.message),
          );
        });
      });
    });
    describe('requestWatchedReposSuccess', () => {
      it('creates an action to save WatchedRepos data', () => {
        const data = { data: 'stuff' };
        const expectedAction = {
          type: types.REQUEST_WATCHED_REPOS_SUCCESS,
          data,
        };
        expect(actions.requestWatchedReposSuccess(data)).toEqual(
          expectedAction,
        );
      });
    });
    describe('requestWatchedReposFail', () => {
      it('creates an action to save WatchedRepos error message', () => {
        const error = 'omfg';
        const expectedAction = {
          type: types.REQUEST_WATCHED_REPOS_FAIL,
          error,
        };
        expect(actions.requestWatchedReposFail(error)).toEqual(expectedAction);
      });
    });
  });

  describe('Saving selected repos', () => {
    describe('toggleRepoSelection', () => {
      it('creates an action to toggle a selected repo', () => {
        const id = 'testId';
        const expectedAction = {
          type: types.TOGGLE_REPO_SELECTION,
          id,
        };
        expect(actions.toggleRepoSelection(id)).toEqual(expectedAction);
      });
    });
  });
  describe('Changing current page of results', () => {
    it('creates an action to change page', () => {
      const page = 1;
      const expectedAction = {
        type: types.CHANGE_REPOS_PAGE,
        page,
      };
      expect(actions.changeReposPage(page)).toEqual(expectedAction);
    });
  });
  describe('Paginating results', () => {
    it('creates an action to paginate results', () => {
      const expectedAction = {
        type: types.PAGINATE_REPOS,
      };
      expect(actions.paginateRepos()).toEqual(expectedAction);
    });
  });
  describe('Filtering results', () => {
    describe('Saving repo filter value', () => {
      it('creates an acion to save the filter value', () => {
        const value = 'test';
        const expectedAction = {
          type: types.SAVE_REPO_FILTER_VALUE,
          value,
        };
        expect(actions.saveRepoFilterValue(value)).toEqual(expectedAction);
      });
    });
    it('creates an action to filter results', () => {
      const expectedAction = {
        type: types.FILTER_REPOS,
      };
      expect(actions.filterRepos()).toEqual(expectedAction);
    });
    describe('performing filtering', () => {
      it('dispatches saveRepoFilterValue and filterRepos actions', () => {
        const dispatch = jest.fn();
        const filterValue = 'value';
        actions.performFiltering(filterValue)(dispatch);
        expect(dispatch.mock.calls[0][0]).toEqual(
          actions.saveRepoFilterValue(filterValue),
        );
        expect(dispatch.mock.calls[1][0]).toEqual(actions.filterRepos());
        expect(dispatch.mock.calls[2][0]).toEqual(actions.paginateRepos());
      });
    });
  });
});
