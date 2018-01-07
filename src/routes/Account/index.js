import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleLogoutModal, logout } from './actions';
import AccountDetails from './components/AccountDetails';

export function AccountContainer({
  login,
  avatarUrl,
  toggleLogoutModalAction,
  logoutAction,
  logoutModalOpen,
}) {
  return (
    <div>
      {login ? (
        <AccountDetails
          login={login}
          avatarUrl={avatarUrl}
          toggleLogoutModal={toggleLogoutModalAction}
          logoutAction={logoutAction}
          logoutModalOpen={logoutModalOpen}
        />
      ) : null}
    </div>
  );
}

AccountContainer.propTypes = {
  login: PropTypes.string,
  avatarUrl: PropTypes.string,
  toggleLogoutModalAction: PropTypes.func.isRequired,
  logoutAction: PropTypes.func.isRequired,
  logoutModalOpen: PropTypes.bool.isRequired,
};

AccountContainer.defaultProps = {
  githubToken: null,
  githubClientId: null,
  githubClientSecret: null,
  login: null,
  avatarUrl: null,
};

const mapStateToProps = state => ({
  githubClientId: state.setup.githubClientId,
  githubClientSecret: state.setup.githubClientSecret,
  githubToken: state.setup.githubToken,
  login: state.home.currentUser ? state.home.currentUser.login : null,
  avatarUrl: state.home.currentUser ? state.home.currentUser.avatarUrl : null,
  logoutModalOpen: state.account.logoutModalOpen,
});

const mapDispatchToProps = dispatch => ({
  toggleLogoutModalAction: () => {
    dispatch(toggleLogoutModal());
  },
  logoutAction: () => {
    dispatch(logout());
  },
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountContainer);
