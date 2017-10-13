import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import ApiForm from './components/ApiForm';
import { saveGithubCredentials, userLogout } from './actions';

import githubAuth from './helpers/githubAuth';

export function LoginContainer({
  redirectPath,
  githubClientSecret,
  githubClientId,
  dispatch,
  saveGithubCredentialsAction,
  currentUser,
  userLogoutAction,
}) {
  const loadContent = () => {
    if (redirectPath) {
      return <Redirect to={redirectPath} />;
    }
    if (currentUser) {
      return (
        <div>
          <h3>Currently signed in as {currentUser.login}.</h3>
          <button
            data-test-id="logoutButton"
            onClick={() => {
              userLogoutAction();
            }}
          >
            Logout
          </button>
        </div>
      );
    }
    if (githubClientId && githubClientSecret) {
      return (
        <button
          data-test-id="signInButton"
          onClick={() => {
            githubAuth(githubClientId, githubClientSecret, dispatch);
          }}
        >
          Sign in with Github
        </button>
      );
    }

    return <ApiForm saveGithubCredentials={saveGithubCredentialsAction} />;
  };

  return <div>{loadContent()}</div>;
}
LoginContainer.propTypes = {
  saveGithubCredentialsAction: PropTypes.func.isRequired,
  githubClientId: PropTypes.string.isRequired,
  githubClientSecret: PropTypes.string.isRequired,
  redirectPath: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  currentUser: PropTypes.shape(),
  userLogoutAction: PropTypes.func.isRequired,
};

LoginContainer.defaultProps = {
  redirectPath: null,
  currentUser: null,
};

const mapStateToProps = state => ({
  githubClientId: state.login.githubClientId,
  githubClientSecret: state.login.githubClientSecret,
  redirectPath: state.login.redirectPath,
  currentUser: state.home.currentUser,
});

const mapDispatchToProps = dispatch => ({
  saveGithubCredentialsAction: credentials => {
    dispatch(saveGithubCredentials(credentials));
  },
  userLogoutAction: () => {
    dispatch(userLogout());
  },
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
