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

  describe('Toggle open repo', () => {
    const repoId = 'id';
    it('creates a toggle repo action', () => {
      const expectedAction = {
        type: types.TOGGLE_OPEN_REPO,
        id: repoId,
      };
      expect(actions.toggleOpenRepo(repoId)).toEqual(expectedAction);
    });

    describe('when id arg is defined', () => {
      it('sets "modal-active" class on document body', () => {
        actions.toggleOpenRepo(repoId);
        expect(Object.values(document.body.classList)).toContain(
          'modal-active',
        );
      });
    });

    describe('when id arg is undefined', () => {
      it('removes "modal-active" class from document body', () => {
        actions.toggleOpenRepo();
        expect(Object.values(document.body.classList)).not.toContain(
          'modal-active',
        );
      });
    });
  });
});
