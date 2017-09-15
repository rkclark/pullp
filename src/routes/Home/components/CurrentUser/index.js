import React from 'react';
import PropTypes from 'prop-types';
import defaultTheme from './theme.css';

export default function CurrentUser({ login, avatarUrl, theme }) {
  return (
    <div className={theme.currentUser}>
      <span>
        Logged in as {login}
      </span>
      <img src={avatarUrl} alt="avatar" />
    </div>
  );
}

CurrentUser.propTypes = {
  login: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string.isRequired,
  theme: PropTypes.shape(),
};

CurrentUser.defaultProps = {
  theme: defaultTheme,
};
