/* eslint-disable no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';

import githubAuth from '../../routes/SetupNew/helpers/githubAuthNew';

import style from './style.css';

import Button from '../Button';
import LoadingMessage from '../LoadingMessage';
import Error from '../Error';

export default function SignInForm({
  saveGithubToken,
  setLoadingToken,
  saveTokenError,
  loadingToken,
  error,
}) {
  return (
    <div className={style.signInContainer}>
      {loadingToken ? (
        <LoadingMessage message={'Authenticating with Github...'} />
      ) : (
        <div>
          {error && (
            <Error
              title={'Github Sign In Failed'}
              message={'Please try again.'}
            />
          )}
          <p className={style.welcome}>Welcome to Pullp!</p>
          <p className={style.begin}>
            To begin, click the button below to sign in with Github:
          </p>
          <Button
            onClick={() => {
              githubAuth(saveGithubToken, setLoadingToken, saveTokenError);
            }}
          >
            Sign in with Github
          </Button>
        </div>
      )}
    </div>
  );
}

SignInForm.propTypes = {
  saveGithubToken: PropTypes.func.isRequired,
  setLoadingToken: PropTypes.func.isRequired,
  saveTokenError: PropTypes.func.isRequired,
  loadingToken: PropTypes.bool,
  error: PropTypes.string,
};

SignInForm.defaultProps = {
  loadingToken: false,
  error: null,
};
