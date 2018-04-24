/* eslint-disable no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';

import githubAuth from '../../helpers/githubAuth';

import style from './style.css';

import Button from '../../../../components/Button';

export default class SignInForm extends React.Component {
  constructor() {
    super();
    this.saveCredentials = this.saveCredentials.bind(this);
  }

  saveCredentials() {
    if (this.githubClientId.value && this.githubClientSecret.value) {
      const credentials = {
        githubClientId: this.githubClientId.value,
        githubClientSecret: this.githubClientSecret.value,
      };
      this.props.saveGithubCredentials(credentials);
    }
  }

  render() {
    const {
      githubClientId,
      githubClientSecret,
      githubToken,
      dispatch,
      logout,
    } = this.props;

    const apiCredsInputs = !githubClientId ? (
      <div>
        <div className={style.infoBar}>
          <span className={style.infoIcon}>i</span>
          <p className={style.infoMessage}>
            To access Github, Pullp needs the client id and client secret for a
            Github oAuth app. Either use one that has already been setup and
            approved by your organisation(s), or register a new one in your
            Github developer settings. See the{' '}
            <a href="https://github.com/rkclark/pullp">Pullp readme</a> for more
            info.
          </p>
        </div>
        <div className={style.apiCredsContainer}>
          <div className={style.inputContainer}>
            <label htmlFor="githubClientId">Client ID</label>
            <input
              name="githubClientId"
              defaultValue=""
              type="text"
              ref={input => (this.githubClientId = input)}
            />
          </div>
          <div className={style.inputContainer}>
            <label htmlFor="githubClientSecret">Client Secret</label>
            <input
              name="githubClientSecret"
              defaultValue=""
              type="text"
              ref={input => (this.githubClientSecret = input)}
            />
          </div>
          <Button onClick={this.saveCredentials}>Save</Button>
        </div>
      </div>
    ) : null;

    const signIn =
      githubClientId && githubClientSecret && !githubToken ? (
        <div className={style.signInContainer}>
          <p>
            Great! You can now click the button below to sign in with Github:
          </p>
          <Button
            onClick={() => {
              githubAuth(dispatch);
            }}
          >
            Sign in with Github
          </Button>
          <p className={style.startOver}>
            Need to change your Github oAuth client id and secret?
          </p>
          <Button onClick={logout}>Start Over</Button>
        </div>
      ) : null;

    return (
      <div>
        {apiCredsInputs}
        {signIn}
      </div>
    );
  }
}

SignInForm.propTypes = {
  saveGithubCredentials: PropTypes.func.isRequired,
  githubClientId: PropTypes.string,
  githubClientSecret: PropTypes.string,
  githubToken: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

SignInForm.defaultProps = {
  githubClientId: null,
  githubClientSecret: null,
  githubToken: null,
};
