import { home as types } from '../../actionTypes';
import githubApi from '../../apis/githubApi';

export const requestApiContentSuccess = results => ({
  type: types.REQUEST_API_CONTENT_SUCCESS,
  results,
});

export const requestApiContentFail = error => ({
  type: types.REQUEST_API_CONTENT_FAIL,
  error,
});

export const requestApiContent = () => async dispatch => {
  try {
    const results = await githubApi.get();
    dispatch(requestApiContentSuccess(results));
  } catch (err) {
    dispatch(requestApiContentFail(err.message));
  }
};
