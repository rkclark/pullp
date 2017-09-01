import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ApiForm from './components/ApiForm';
import { saveGithubCredentials } from './actions';

function LoginContainer(props) {
  return (
    <div>
      <h1>Login</h1>
      <ApiForm saveGithubCredentials={props.saveGithubCredentials} />
    </div>
  );
}
LoginContainer.propTypes = {
  saveGithubCredentials: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      saveGithubCredentials,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
