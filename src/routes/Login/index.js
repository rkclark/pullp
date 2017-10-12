import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import ApiForm from './components/ApiForm';
import { saveGithubCredentials } from './actions';

import githubAuth from './helpers/githubAuth';

export function LoginContainer({
  redirectPath,
  githubClientSecret,
  githubClientId,
  dispatch,
  saveGithubCredentialsAction,
}) {
  let content;
  if (redirectPath) {
    content = <Redirect to={redirectPath} />;
  } else {
    githubClientId && githubClientSecret
      ? (content = (
          <button
            data-test-id="signInButton"
            onClick={() => {
              githubAuth(githubClientId, githubClientSecret, dispatch);
            }}
          >
            Sign in with Github
          </button>
        ))
      : (content = (
          <ApiForm saveGithubCredentials={saveGithubCredentialsAction} />
        ));
  }
  return (
    <div>
      <h1>Github Sign In</h1>
      {content}
    </div>
  );
}
LoginContainer.propTypes = {
  saveGithubCredentialsAction: PropTypes.func.isRequired,
  githubClientId: PropTypes.string.isRequired,
  githubClientSecret: PropTypes.string.isRequired,
  redirectPath: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
};

LoginContainer.defaultProps = {
  redirectPath: null,
};

const mapStateToProps = state => ({
  githubClientId: state.login.githubClientId,
  githubClientSecret: state.login.githubClientSecret,
  redirectPath: state.login.redirectPath,
});

const mapDispatchToProps = dispatch => ({
  saveGithubCredentialsAction: credentials => {
    dispatch(saveGithubCredentials(credentials));
  },
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
