/* eslint-disable no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';

export default class ApiForm extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
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
    return (
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
    );
  }
}

ApiForm.propTypes = {
  saveGithubCredentials: PropTypes.func.isRequired,
};
