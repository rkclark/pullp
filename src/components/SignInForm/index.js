/* eslint-disable no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';

import githubAuth from '../../routes/Setup/helpers/githubAuth';

import style from './style.css';

import Button from '../Button';

export default function SignInForm({ githubToken, dispatch }) {
  const signIn = !githubToken ? (
    <div className={style.signInContainer}>
      <p className={style.welcome}>Welcome to Pullp!</p>
      <p className={style.begin}>
        To begin, click the button below to sign in with Github:
      </p>
      <Button
        onClick={() => {
          githubAuth(dispatch);
        }}
      >
        Sign in with Github
      </Button>
    </div>
  ) : null;

  return <div>{signIn}</div>;
}

SignInForm.propTypes = {
  githubToken: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
};

SignInForm.defaultProps = {
  githubToken: null,
};
