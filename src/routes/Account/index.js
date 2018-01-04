import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import SignInForm from './components/SignInForm';
import { saveGithubCredentials } from './actions';
import AccountDetails from './components/AccountDetails';

export function AccountContainer({
  redirectPath,
  githubClientId,
  githubClientSecret,
  saveGithubCredentialsAction,
  githubToken,
  dispatch,
  login,
  avatarUrl,
}) {
  let content;
  if (redirectPath) {
    content = <Redirect to={redirectPath} />;
  } else if (login) {
    content = <AccountDetails login={login} avatarUrl={avatarUrl} />;
  } else {
    content = (
      <SignInForm
        saveGithubCredentials={saveGithubCredentialsAction}
        githubClientId={githubClientId}
        githubClientSecret={githubClientSecret}
        githubToken={githubToken}
        dispatch={dispatch}
      />
    );
  }

  return <div>{content}</div>;
}

AccountContainer.propTypes = {
  saveGithubCredentialsAction: PropTypes.func.isRequired,
  githubClientId: PropTypes.string,
  githubClientSecret: PropTypes.string,
  redirectPath: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  githubToken: PropTypes.string,
  login: PropTypes.string,
  avatarUrl: PropTypes.string,
};

AccountContainer.defaultProps = {
  redirectPath: null,
  githubToken: null,
  githubClientId: null,
  githubClientSecret: null,
  login: null,
  avatarUrl: null,
};

const mapStateToProps = state => ({
  githubClientId: state.login.githubClientId,
  githubClientSecret: state.login.githubClientSecret,
  redirectPath: state.login.redirectPath,
  githubToken: state.login.githubToken,
  login: state.home.currentUser.login,
  avatarUrl: state.home.currentUser.avatarUrl,
});

const mapDispatchToProps = dispatch => ({
  saveGithubCredentialsAction: credentials => {
    dispatch(saveGithubCredentials(credentials));
  },
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountContainer);
