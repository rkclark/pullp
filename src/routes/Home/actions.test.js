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
          getMock.returns(testError);
        });
        afterEach(() => {
          queryMock.restore();
          getMock.restore();
        });
        it('dispatches requestApiContentFail with the error message', async () => {
          const requestCurrentUser = actions.requestCurrentUser('testToken');
          const dispatch = jest.fn();
          await requestCurrentUser(dispatch);
          expect(dispatch).toHaveBeenCalledWith(
            actions.requestCurrentUserFail(testError.message),
          );
        });
      });
    });
  });
});
