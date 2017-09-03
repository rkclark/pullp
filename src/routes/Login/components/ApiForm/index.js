import React from 'react';
import PropTypes from 'prop-types';

export default class ApiForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { githubClientId: '', githubClientSecret: '' };
    this.props = props;
    this.handleChange = this.handleChange.bind(this);
    this.saveCredentials = this.saveCredentials.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  saveCredentials() {
    this.props.saveGithubCredentials(this.state);
  }

  render() {
    return (
      <div>
        <h2>Enter your Github oAuth App details:</h2>
        <label htmlFor="githubClientId">Client ID</label>
        <input
          name="githubClientId"
          type="text"
          value={this.state.githubClientId}
          onChange={this.handleChange}
        />
        <label htmlFor="githubClientSecret">Client Secret</label>
        <input
          name="githubClientSecret"
          type="text"
          value={this.state.githubClientSecret}
          onChange={this.handleChange}
        />
        <button onClick={this.saveCredentials}>Save</button>
      </div>
    );
  }
}

ApiForm.propTypes = {
  saveGithubCredentials: PropTypes.func.isRequired,
};
