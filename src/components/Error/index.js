import React from 'react';
import PropTypes from 'prop-types';

import defaultTheme from './theme.css';

export default function Error({ message, theme }) {
  return (
    <div className={theme.container}>
      <span className={theme.icon}>!</span>
      <p className={theme.message}>{message}</p>
    </div>
  );
}

Error.propTypes = {
  message: PropTypes.string,
  theme: PropTypes.shape({}),
};

Error.defaultProps = {
  message: 'Oh no! Pullp encountered an error :(',
  theme: defaultTheme,
};
