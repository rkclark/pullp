import sinon from 'sinon';
import { selectRepos as types } from '../../actionTypes';
import * as actions from './actions';
import * as githubApi from '../../apis/githubApi';

describe('SelectRepos actions', () => {
  describe('Retrieving watched repos', () => {
    describe('requestWatchedRepos', () => {
      describe('when call to github succeeds', () => {
        let queryMock;
        let getMock;
        let testResult;
        beforeEach(() => {
          queryMock = sinon.stub(githubApi.queries, 'watchedRepos');
          const testQuery = '{ query }';
          queryMock.returns(testQuery);
          getMock = sinon.stub(githubApi, 'get');
          testResult = {
            data: {
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
                      },
                    },
                    {
                      node: {
                        name: 'Repo2',
                      },
                    },
                  ],
                },
              },
            },
          };
          getMock.returns(testResult);
        });
        afterEach(() => {
          queryMock.restore();
          getMock.restore();
        });
        it('dispatches requestWatchedReposSuccess with the result', async () => {
          const requestWatchedRepos = actions.requestWatchedRepos('testToken');
          const dispatch = jest.fn();
          await requestWatchedRepos(dispatch);
          expect(dispatch).toHaveBeenCalledWith(
            actions.requestWatchedReposSuccess(testResult),
          );
        });
      });
      describe('when call to github fails', () => {
        let queryMock;
        let getMock;
        let testError;
        beforeEach(() => {
          queryMock = sinon.stub(githubApi.queries, 'watchedRepos');
          const testQuery = '{ query }';
          queryMock.returns(testQuery);
          getMock = sinon.stub(githubApi, 'get');
          testError = new Error('Omfg');
          getMock.throws(testError);
        });
        afterEach(() => {
          queryMock.restore();
          getMock.restore();
        });
        it('dispatches requestWatchedReposFail with the error message', async () => {
          const requestWatchedRepos = actions.requestWatchedRepos('testToken');
          const dispatch = jest.fn();
          await requestWatchedRepos(dispatch);
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
