import React from 'react';
import PropTypes from 'prop-types';
import LogoutModal from '../LogoutModal';
import Button from '../Button';

import style from './style.css';

export default function AccountDetails({
  login,
  avatarUrl,
  toggleLogoutModal,
  logout,
  logoutModalOpen,
}) {
  return (
    <div className={style.container}>
      <img src={avatarUrl} alt="avatar" className={style.avatar} />
      <h2 className={style.description}>
        SIGNED IN AS: <strong>{login}</strong>
      </h2>
      <Button onClick={toggleLogoutModal}>Sign out</Button>
      <LogoutModal
        toggleLogoutModal={toggleLogoutModal}
        logout={logout}
        logoutModalOpen={logoutModalOpen}
      />
    </div>
  );
}

AccountDetails.propTypes = {
  login: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string.isRequired,
  toggleLogoutModal: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  logoutModalOpen: PropTypes.bool.isRequired,
};
