/* eslint-disable no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';

import githubAuth from '../../routes/Setup/helpers/githubAuthNew';

import style from './style.css';

import Button from '../Button';
import LoadingMessage from '../LoadingMessage';

export default function SignInForm({
  saveGithubToken,
  setLoadingToken,
  loadingToken,
}) {
  if (loadingToken) {
    return <LoadingMessage message={'Authenticating with Github...'} />;
  }

  return (
    <div className={style.signInContainer}>
      <p className={style.welcome}>Welcome to Pullp!</p>
      <p className={style.begin}>
        To begin, click the button below to sign in with Github:
      </p>
      <Button
        onClick={() => {
          githubAuth(saveGithubToken, setLoadingToken);
        }}
      >
        Sign in with Github
      </Button>
    </div>
  );
}

SignInForm.propTypes = {
  saveGithubToken: PropTypes.func.isRequired,
  setLoadingToken: PropTypes.func.isRequired,
  loadingToken: PropTypes.bool,
};

SignInForm.defaultProps = {
  loadingToken: false,
};
