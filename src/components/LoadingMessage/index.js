import React from 'react';
import PropTypes from 'prop-types';
import LoadingIcon from '../LoadingIcon';
import defaultTheme from './theme.css';

export default function LoadingMessage({ theme, message }) {
  return (
    <div className={theme.container}>
      <div className={theme.loadingContainer}>
        <LoadingIcon />
      </div>
      <p className={theme.loadingMessage}>{message}</p>
    </div>
  );
}

LoadingMessage.propTypes = {
  theme: PropTypes.shape({}),
  message: PropTypes.string.isRequired,
};

LoadingMessage.defaultProps = {
  theme: defaultTheme,
};
