/* eslint-disable no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';

import githubAuth from '../../helpers/githubAuth';

import style from './style.css';

export default class SignInForm extends React.Component {
  constructor() {
    super();
    this.saveCredentials = this.saveCredentials.bind(this);
  }

  saveCredentials() {
    const credentials = {
      githubClientId: this.githubClientId.value,
      githubClientSecret: this.githubClientSecret.value,
    };
    this.props.saveGithubCredentials(credentials);
  }

  render() {
    const {
      githubClientId,
      githubClientSecret,
      githubToken,
      dispatch,
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
          <p>Enter your Github oAuth app client id and client secret below:</p>
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
          <button onClick={this.saveCredentials}>Save</button>
        </div>
      </div>
    ) : null;

    const signInButton =
      githubClientId && githubClientSecret && !githubToken ? (
        <button
          onClick={() => {
            githubAuth(githubClientId, githubClientSecret, dispatch);
          }}
        >
          Sign in with Github
        </button>
      ) : null;

    return (
      <div>
        {apiCredsInputs}
        {signInButton}
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
};

SignInForm.defaultProps = {
  githubClientId: null,
  githubClientSecret: null,
  githubToken: null,
};
