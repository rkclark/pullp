import React from 'react';
import PropTypes from 'prop-types';

export default class ApiForm extends React.Component {
  constructor(props) {
    super(props);
    // this.state = { githubClientId: '', githubClientSecret: '' };
    this.props = props;
    // this.handleChange = this.handleChange.bind(this);
    this.saveCredentials = this.saveCredentials.bind(this);
  }

  // handleChange(event) {
  //   this.setState({ [event.target.name]: event.target.value });
  // }

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
        <h2>Enter your Github oAuth App details:</h2>

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
