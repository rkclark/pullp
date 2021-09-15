/* eslint-disable no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';

import style from './style.css';

import Button from '../Button';
import LoadingMessage from '../LoadingMessage';
import Error from '../Error';

export default function SignInForm({ loadingToken, error }) {
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
              const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
              const githubUrl = process.env.REACT_APP_GITHUB_AUTH_URL;
              window.electron.authApi.trigger({ clientId, githubUrl });
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
  loadingToken: PropTypes.bool,
  error: PropTypes.string,
};

SignInForm.defaultProps = {
  loadingToken: false,
  error: null,
};
