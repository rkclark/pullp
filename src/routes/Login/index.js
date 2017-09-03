import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import ApiForm from './components/ApiForm';
import { saveGithubCredentials } from './actions';

import { githubAuth } from './helpers/githubAuth';

function LoginContainer(props) {
  let content;

  props.loginState.githubClientId && props.loginState.githubClientSecret
    ? (content = (
        <button
          onClick={githubAuth(
            props.loginState.githubClientId,
            props.loginState.githubClientSecret,
            props.dispatch,
          )}
        >
          Sign in with Github
        </button>
      ))
    : (content = (
        <ApiForm saveGithubCredentials={props.saveGithubCredentials} />
      ));

  return (
    <div>
      <h1>Login</h1>
      {content}
    </div>
  );
}
LoginContainer.propTypes = {
  saveGithubCredentials: PropTypes.func.isRequired,
  loginState: PropTypes.shape({
    githubClientId: PropTypes.string.isRequired,
    githubClientSecret: PropTypes.string.isRequired,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  loginState: state.login,
});

// const mapDispatchToProps = dispatch =>
//   bindActionCreators(
//     {
//       saveGithubCredentials,
//       dispatch,
//     },
//     dispatch,
//   );

const mapDispatchToProps = dispatch => ({
  saveGithubCredentials() {
    dispatch(saveGithubCredentials());
  },
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
