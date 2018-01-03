import React from 'react';
import PropTypes from 'prop-types';

export default function AccountDetails({ login, avatarUrl }) {
  return (
    <div>
      <h2>Signed in as {login}</h2>
      <img src={avatarUrl} alt="avatar" />
    </div>
  );
}

AccountDetails.propTypes = {
  login: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string.isRequired,
};
