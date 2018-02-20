import sinon from 'sinon';
import { home as types } from '../../actionTypes';
import * as actions from './actions';
import * as githubApi from '../../apis/githubApi';

describe('Home actions', () => {
  describe('Retrieving current user data', () => {
    describe('requestCurrentUser', () => {
      describe('when call to github succeeds', () => {
        let queryMock;
        let getMock;
        let testResult;
        beforeEach(() => {
          queryMock = sinon.stub(githubApi.queries, 'currentUser');
          const testQuery = '{ query }';
          queryMock.returns(testQuery);
          getMock = sinon.stub(githubApi, 'get');
          testResult = {
            data: {
              login: 'userName',
              avatarUrl: 'url',
            },
          };
          getMock.returns(testResult);
        });
        afterEach(() => {
          queryMock.restore();
          getMock.restore();
        });
        it('dispatches requestCurrentUserLoading', async () => {
          const requestCurrentUser = actions.requestCurrentUser('testToken');
          const dispatch = jest.fn();
          await requestCurrentUser(dispatch);
          expect(dispatch).toHaveBeenCalledWith(
            actions.requestCurrentUserLoading(),
          );
        });
        it('dispatches requestCurrentUserSuccess with the result', async () => {
          const requestCurrentUser = actions.requestCurrentUser('testToken');
          const dispatch = jest.fn();
          await requestCurrentUser(dispatch);
          expect(dispatch).toHaveBeenCalledWith(
            actions.requestCurrentUserSuccess(testResult),
          );
        });
      });
      describe('when call to github fails', () => {
        let queryMock;
        let getMock;
        let testError;
        beforeEach(() => {
          queryMock = sinon.stub(githubApi.queries, 'currentUser');
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
        it('dispatches requestCurrentUserFail with the error message', async () => {
          const requestCurrentUser = actions.requestCurrentUser('testToken');
          const dispatch = jest.fn();
          await requestCurrentUser(dispatch);
          expect(dispatch).toHaveBeenCalledWith(
            actions.requestCurrentUserFail(testError.message),
          );
        });
      });
    });
    describe('requestCurrentUserSuccess', () => {
      it('creates an action to save currentUser data', () => {
        const data = { data: 'stuff' };
        const expectedAction = {
          type: types.REQUEST_CURRENT_USER_SUCCESS,
          data,
        };
        expect(actions.requestCurrentUserSuccess(data)).toEqual(expectedAction);
      });
    });
    describe('requestCurrentUserFail', () => {
      it('creates an action to save currentUser error message', () => {
        const error = 'omfg';
        const expectedAction = {
          type: types.REQUEST_CURRENT_USER_FAIL,
          error,
        };
        expect(actions.requestCurrentUserFail(error)).toEqual(expectedAction);
      });
    });
    describe('requestCurrentUserLoading', () => {
      it('creates an action to save currentUser error message', () => {
        const expectedAction = {
          type: types.REQUEST_CURRENT_USER_LOADING,
        };
        expect(actions.requestCurrentUserLoading()).toEqual(expectedAction);
      });
    });
  });

  describe('Retrieving user teams data', () => {
    describe('requestUserTeams', () => {
      describe('when call to github succeeds', () => {
        let queryMock;
        let getMock;
        let testResult;
        beforeEach(() => {
          queryMock = sinon.stub(githubApi.queries, 'userTeams');
          const testQuery = '{ query }';
          queryMock.returns(testQuery);
          getMock = sinon.stub(githubApi, 'get');
          testResult = {
            data: {
              test: 'data',
            },
          };
          getMock.returns(testResult);
        });
        afterEach(() => {
          queryMock.restore();
          getMock.restore();
        });
        it('dispatches requestUserTeamsSuccess with the result', async () => {
          const requestUserTeams = actions.requestUserTeams('testToken');
          const dispatch = jest.fn();
          const getState = () => ({
            home: {
              currentUser: {
                login: 'testUserLogin',
              },
            },
          });
          await requestUserTeams(dispatch, getState);
          expect(dispatch).toHaveBeenCalledWith(
            actions.requestUserTeamsSuccess(testResult),
          );
        });
      });
      describe('when call to github fails', () => {
        let queryMock;
        let getMock;
        let testError;
        beforeEach(() => {
          queryMock = sinon.stub(githubApi.queries, 'userTeams');
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
        it('dispatches requestUserTeamsFail with the error message', async () => {
          const requestUserTeams = actions.requestUserTeams('testToken');
          const dispatch = jest.fn();
          const getState = () => ({
            home: {
              currentUser: {
                login: 'testUserLogin',
              },
            },
          });
          await requestUserTeams(dispatch, getState);
          expect(dispatch).toHaveBeenCalledWith(
            actions.requestUserTeamsFail(testError.message),
          );
        });
      });
    });
    describe('requestUserTeamsSuccess', () => {
      it('creates an action to save user teams data', () => {
        const data = { data: 'stuff' };
        const expectedAction = {
          type: types.REQUEST_USER_TEAMS_SUCCESS,
          data,
        };
        expect(actions.requestUserTeamsSuccess(data)).toEqual(expectedAction);
      });
    });
    describe('requestUserTeamsFail', () => {
      it('creates an action to save user teams error message', () => {
        const error = 'omfg';
        const expectedAction = {
          type: types.REQUEST_USER_TEAMS_FAIL,
          error,
        };
        expect(actions.requestUserTeamsFail(error)).toEqual(expectedAction);
      });
    });
  });
  describe('Retrieving pull request data', () => {
    describe('requestPullRequests', () => {
      describe('when call to github succeeds', () => {
        let queryMock;
        let getMock;
        let testResult;
        beforeEach(() => {
          queryMock = sinon.stub(githubApi.queries, 'pullRequests');
          const testQuery = '{ query }';
          queryMock.returns(testQuery);
          getMock = sinon.stub(githubApi, 'get');
          testResult = {
            data: {
              some: 'stuff',
            },
          };
          getMock.returns(testResult);
        });
        afterEach(() => {
          queryMock.restore();
          getMock.restore();
        });
        it('dispatches requestPullRequestsLoading and requestPullRequestsSuccess with the result', async () => {
          const requestPullRequests = actions.requestPullRequests('testToken');
          const watchedRepos = [1, 2, 3];
          const dispatch = jest.fn();
          const getState = () => ({
            selectRepos: {
              watchedRepos,
            },
          });
          await requestPullRequests(dispatch, getState);
          expect(dispatch.mock.calls[0][0]).toEqual(
            actions.requestPullRequestsLoading(),
          );
          expect(dispatch.mock.calls[1][0]).toEqual(
            actions.requestPullRequestsSuccess(testResult, watchedRepos),
          );
        });
      });
      describe('when call to github fails', () => {
        let queryMock;
        let getMock;
        let testError;
        beforeEach(() => {
          queryMock = sinon.stub(githubApi.queries, 'pullRequests');
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
        it('dispatches requestPullRequestsLoading and requestPullRequestsFail with the error message', async () => {
          const requestPullRequests = actions.requestPullRequests('testToken');
          const watchedRepos = [1, 2, 3];
          const dispatch = jest.fn();
          const getState = () => ({
            selectRepos: {
              watchedRepos,
            },
          });
          await requestPullRequests(dispatch, getState);
          expect(dispatch.mock.calls[0][0]).toEqual(
            actions.requestPullRequestsLoading(),
          );
          expect(dispatch.mock.calls[1][0]).toEqual(
            actions.requestPullRequestsFail(testError.message),
          );
        });
      });
    });
    describe('requestPullRequestsSuccess', () => {
      it('creates an action to save Pull Requests data', () => {
        const data = { data: 'stuff' };
        const watchedRepos = [1, 2, 3];
        const expectedAction = {
          type: types.REQUEST_PULL_REQUESTS_SUCCESS,
          data,
          watchedRepos,
        };
        expect(actions.requestPullRequestsSuccess(data, watchedRepos)).toEqual(
          expectedAction,
        );
      });
    });
    describe('requestPullRequestsFail', () => {
      it('creates an action to save Pull Requests error message', () => {
        const error = 'omfg';
        const expectedAction = {
          type: types.REQUEST_PULL_REQUESTS_FAIL,
          error,
        };
        expect(actions.requestPullRequestsFail(error)).toEqual(expectedAction);
      });
    });
  });
  describe('Toggle open repo', () => {
    it('creates a toggle repo action', () => {
      const repoId = 'id';
      const expectedAction = {
        type: types.TOGGLE_OPEN_REPO,
        id: repoId,
      };
      expect(actions.toggleOpenRepo(repoId)).toEqual(expectedAction);
    });
  });
});
