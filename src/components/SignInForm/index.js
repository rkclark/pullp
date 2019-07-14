/* eslint-disable no-return-assign, no-console */

import React from 'react';
import PropTypes from 'prop-types';

import githubAuth from '../../routes/SetupBrowser/helpers/githubAuth';

import style from './style.css';

import Button from '../Button';
import LoadingMessage from '../LoadingMessage';
import Error from '../Error';

const hasElectron = typeof window.electron !== 'undefined';

const { REACT_APP_GITHUB_CLIENT_ID } = process.env;

const CLIENT_ID = REACT_APP_GITHUB_CLIENT_ID;
const REDIRECT_URI = 'http://localhost:3333/';
const scopes = ['read:org', 'repo'];
const githubUrl = 'https://github.com/login/oauth/authorize';
const authUrl = `${githubUrl}?client_id=${CLIENT_ID}&scope=${scopes}&redirect_uri=${REDIRECT_URI}`;

export default function SignInForm({
  saveGithubToken,
  setLoadingToken,
  saveTokenError,
  loadingToken,
  error,
}) {
  console.log('**SIGNINFORM');
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
          {hasElectron && (
            <Button
              onClick={() => {
                githubAuth(saveGithubToken, setLoadingToken, saveTokenError);
              }}
            >
              Sign in with Github
            </Button>
          )}
          {!hasElectron && (
            <div>
              <a href={authUrl}>Login</a>
            </div>
          )}
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
