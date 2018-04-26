/* eslint-disable no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';

import githubAuth from '../../helpers/githubAuth';

import style from './style.css';

import Button from '../../../../components/Button';

export default function SignInForm({ githubToken, dispatch }) {
  const signIn = !githubToken ? (
    <div className={style.signInContainer}>
      <p>Click the button below to sign in with Github:</p>
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
