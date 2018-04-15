import fetchMock from 'fetch-mock';
import * as actions from './actions';
import { setup as types } from '../../actionTypes';
import { SERVER_PORT } from '../../constants';

describe('Login actions', () => {
  describe('saveGithubCredentials', () => {
    it('creates an action to save github credentials', () => {
      const credentials = { id: 'test', secret: 'test' };
      const expectedAction = {
        type: types.SAVE_GITHUB_CREDENTIALS,
        credentials,
      };
      expect(actions.saveGithubCredentials(credentials)).toEqual(
        expectedAction,
      );
    });
  });

  describe('requestGithubToken', () => {
    describe('when call to pullp oAuth server succeeds', () => {
      it('dispatches requestGithubTokenSuccess action with the received token', async () => {
        const result = { access_token: 'anAccessToken' };
        fetchMock.mock(`http://localhost:${SERVER_PORT}/authenticate/`, result);
        const requestGithubToken = actions.requestGithubToken({
          client_id: 'id',
          client_secret: 'secret',
          code: 'code',
        });
        const dispatch = jest.fn();
        await requestGithubToken(dispatch);
        expect(dispatch).toHaveBeenCalledWith(
          actions.requestGithubTokenSuccess(result.access_token),
        );
        fetchMock.restore();
      });
    });
  });
  describe('when call to pullp oAuth server fails', () => {
    it('dispatches requestGithubTokenFailure action with the received error', async () => {
      fetchMock.mock(`http://localhost:${SERVER_PORT}/authenticate/`, 400);
      const requestGithubToken = actions.requestGithubToken({
        client_id: 'id',
        client_secret: 'secret',
        code: 'code',
      });
      const dispatch = jest.fn();
      await requestGithubToken(dispatch);
      const errorObj = dispatch.mock.calls[0][0];
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
});
