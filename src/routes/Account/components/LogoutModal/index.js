import React from 'react';
import PropTypes from 'prop-types';
import style from './style.css';

export default function LogoutModal({
  logoutAction,
  logoutModalOpen,
  toggleLogoutModal,
}) {
  const content = logoutModalOpen ? (
    <div>
      <h2>Are you sure you want to logout?</h2>
      <p>
        This is will clear all of your selected repos and your Github oAuth
        application details!
      </p>
      <button className={style.yesButton} onClick={logoutAction}>
        Yes
      </button>
      <button className={style.noButton} onClick={toggleLogoutModal}>
        No
      </button>
      <div className={style.modalOverlay} />
    </div>
  ) : null;
  return content;
}

LogoutModal.propTypes = {
  logoutModalOpen: PropTypes.bool.isRequired,
  logoutAction: PropTypes.func.isRequired,
  toggleLogoutModal: PropTypes.func.isRequired,
};
