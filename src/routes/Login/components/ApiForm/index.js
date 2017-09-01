import React from 'react';
import PropTypes from 'prop-types';

export default class ApiForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { clientId: '', clientSecret: '' };
    this.props = props;
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    return (
      <div>
        <h2>Enter your Github oAuth App details:</h2>
        <label htmlFor="clientId">Client ID</label>
        <input
          name="clientId"
          type="text"
          value={this.state.clientId}
          onChange={this.handleChange}
        />
        <label htmlFor="clientSecret">Client Secret</label>
        <input
          name="clientSecret"
          type="text"
          value={this.state.clientSecret}
          onChange={this.handleChange}
        />
        <button onClick={this.props.saveGithubCredentials(this.state)}>
          Save
        </button>
      </div>
    );
  }
}

ApiForm.propTypes = {
  saveGithubCredentials: PropTypes.func.isRequired,
};
