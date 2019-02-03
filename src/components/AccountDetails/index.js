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
      <h2 className={style.title}>
        Signed in as <strong>{login}</strong>
      </h2>
      <img src={avatarUrl} alt="avatar" className={style.avatar} />
      <div className={style.signout}>
        <Button onClick={toggleLogoutModal}>Sign out</Button>
      </div>
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
