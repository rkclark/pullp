import React from 'react';
import PropTypes from 'prop-types';

export default function AccountDetails({
  login,
  avatarUrl,
  toggleLogoutModal,
}) {
  return (
    <div>
      <h2>Signed in as {login}</h2>
      <img src={avatarUrl} alt="avatar" />
      <button onClick={toggleLogoutModal}>Logout</button>
    </div>
  );
}

AccountDetails.propTypes = {
  login: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string.isRequired,
  toggleLogoutModal: PropTypes.func.isRequired,
};
