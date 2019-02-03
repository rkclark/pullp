import React from 'react';
import PropTypes from 'prop-types';
import style from './style.css';
import Button from '../Button';

export default function LogoutModal({
  logout,
  logoutModalOpen,
  toggleLogoutModal,
}) {
  const content = logoutModalOpen ? (
    <div>
      <div className={style.container}>
        <div className={style.modalContent}>
          <h2>Are you sure you want to sign out?</h2>
          <p>This will clear all of your settings!</p>
          <div className={style.yesButton}>
            <Button onClick={logout}>Yes</Button>
          </div>
          <div className={style.noButton}>
            <Button onClick={toggleLogoutModal}>No</Button>
          </div>
        </div>
      </div>
      <div
        className={style.modalOverlay}
        onClick={toggleLogoutModal}
        role="button"
        tabIndex={0}
      />
    </div>
  ) : null;
  return content;
}

LogoutModal.propTypes = {
  logoutModalOpen: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  toggleLogoutModal: PropTypes.func.isRequired,
};
