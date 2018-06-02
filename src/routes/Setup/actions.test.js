import fetchMock from 'fetch-mock';
import * as actions from './actions';
import { setup as types } from '../../actionTypes';

describe('Login actions', () => {
  const code = '1234';
  const gatekeeperUrl = `${process.env.REACT_APP_OAUTH_GATEKEEPER_URL}/${code}`;

  describe('requestGithubToken', () => {
    it('dispatches requestGithubTokenLoading action', async () => {
      const result = { token: 'anAccessToken' };
      fetchMock.mock(gatekeeperUrl, result);
      const requestGithubToken = actions.requestGithubToken(code);
      const dispatch = jest.fn();
      await requestGithubToken(dispatch);
      expect(dispatch).toHaveBeenCalledWith(
        actions.requestGithubTokenLoading(),
      );
      fetchMock.restore();
    });

    describe('when call to pullp oAuth server succeeds', () => {
      it('dispatches requestGithubTokenSuccess action with the received token', async () => {
        const result = { token: 'anAccessToken' };
        fetchMock.mock(gatekeeperUrl, result);
        const requestGithubToken = actions.requestGithubToken(code);
        const dispatch = jest.fn();
        await requestGithubToken(dispatch);
        expect(dispatch).toHaveBeenCalledWith(
          actions.requestGithubTokenSuccess(result.token),
        );
        fetchMock.restore();
      });
    });
  });
  describe('when call to pullp oAuth server fails', () => {
    it('dispatches requestGithubTokenFailure action with the received error', async () => {
      fetchMock.mock(gatekeeperUrl, 400);
      const requestGithubToken = actions.requestGithubToken(code);
      const dispatch = jest.fn();
      await requestGithubToken(dispatch);
      const errorObj = dispatch.mock.calls[1][0];
      expect(errorObj.type).toEqual(types.REQUEST_GITHUB_TOKEN_FAILURE);
      expect(errorObj.error).toBeDefined;
      fetchMock.restore();
    });
  });

  describe('requestGithubTokenSuccess', () => {
    it('creates an action to save github token', () => {
      const token = 'test';
      const expectedAction = {
        type: types.REQUEST_GITHUB_TOKEN_SUCCESS,
        token,
      };
      expect(actions.requestGithubTokenSuccess(token)).toEqual(expectedAction);
    });
  });

  describe('requestGithubTokenFailure', () => {
    it('creates an action to save github token request error', () => {
      const error = 'test';
      const expectedAction = {
        type: types.REQUEST_GITHUB_TOKEN_FAILURE,
        error,
      };
      expect(actions.requestGithubTokenFailure(error)).toEqual(expectedAction);
    });
  });

  describe('requestGithubTokenLoading', () => {
    it('creates an action to save github token loading state', () => {
      const expectedAction = {
        type: types.REQUEST_GITHUB_TOKEN_LOADING,
      };
      expect(actions.requestGithubTokenLoading()).toEqual(expectedAction);
    });
  });
});
