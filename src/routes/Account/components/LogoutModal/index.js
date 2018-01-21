import React from 'react';
import PropTypes from 'prop-types';
import style from './style.css';
import Button from '../../../../components/Button';

export default function LogoutModal({
  logoutAction,
  logoutModalOpen,
  toggleLogoutModal,
}) {
  const content = logoutModalOpen ? (
    <div>
      <div className={style.container}>
        <div className={style.modalContent}>
          <h2>Are you sure you want to sign out?</h2>
          <p>
            This is will clear all of your selected repos and your Github oAuth
            application details!
          </p>
          <div className={style.yesButton}>
            <Button onClick={logoutAction}>Yes</Button>
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
  logoutAction: PropTypes.func.isRequired,
  toggleLogoutModal: PropTypes.func.isRequired,
};
