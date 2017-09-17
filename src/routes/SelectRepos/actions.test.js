import sinon from 'sinon';
import { selectRepos as types } from '../../actionTypes';
import * as actions from './actions';
import * as githubApi from '../../apis/githubApi';

describe('SelectRepos actions', () => {
  describe('Retrieving watched repos', () => {
    describe('requestWatchedRepos', () => {
      describe('when call to github succeeds', () => {
        describe('when results do not have a nextPage', () => {
          it('dispatches requestWatchedReposSuccess with the result', async () => {
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
                      },
                    },
                    {
                      cursor: 'adsatgdgrsgsdf',
                      node: {
                        name: 'test2',
                        id: 'testid2==',
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
              },
              {
                name: 'test2',
                id: 'testid2==',
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
            expect(dispatch).toHaveBeenCalledWith(
              actions.requestWatchedReposSuccess(expectedResult),
            );
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
                      },
                    },
                    {
                      cursor: testCursor,
                      node: {
                        name: 'minesweeper',
                        id: 'MDEwOlJlcG9zaXRvcnk3Mjc1NzkxNg==',
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
                      },
                    },
                    {
                      cursor: 'adsatgdgrsgsdf',
                      node: {
                        name: 'test2',
                        id: 'testid2==',
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
              },
              {
                name: 'minesweeper',
                id: 'MDEwOlJlcG9zaXRvcnk3Mjc1NzkxNg==',
              },
              {
                name: 'test1',
                id: 'testid1==',
              },
              {
                name: 'test2',
                id: 'testid2==',
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
});
