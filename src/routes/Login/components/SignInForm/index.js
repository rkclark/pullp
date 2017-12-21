/* eslint-disable no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';

import githubAuth from '../../helpers/githubAuth';

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
        <h2>
          Pullp needs your Github oAuth app details before it can sign you into
          Github!
        </h2>
        <p>Enter your client id and client secret below:</p>
        <label htmlFor="githubClientId">Client ID</label>
        <input
          name="githubClientId"
          defaultValue=""
          type="text"
          ref={input => (this.githubClientId = input)}
        />
        <label htmlFor="githubClientSecret">Client Secret</label>
        <input
          name="githubClientSecret"
          defaultValue=""
          type="text"
          ref={input => (this.githubClientSecret = input)}
        />
        <button onClick={this.saveCredentials}>Save</button>
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
