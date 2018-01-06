import React from 'react';
import PropTypes from 'prop-types';
import LogoutModal from '../LogoutModal';

export default function AccountDetails({
  login,
  avatarUrl,
  toggleLogoutModal,
  logoutAction,
  logoutModalOpen,
}) {
  return (
    <div>
      <h2>Signed in as {login}</h2>
      <img src={avatarUrl} alt="avatar" />
      <button onClick={toggleLogoutModal}>Logout</button>
      <LogoutModal
        toggleLogoutModal={toggleLogoutModal}
        logoutAction={logoutAction}
        logoutModalOpen={logoutModalOpen}
      />
    </div>
  );
}

AccountDetails.propTypes = {
  login: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string.isRequired,
  toggleLogoutModal: PropTypes.func.isRequired,
  logoutAction: PropTypes.func.isRequired,
  logoutModalOpen: PropTypes.bool.isRequired,
};
