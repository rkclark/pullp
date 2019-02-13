import React from 'react';
import PropTypes from 'prop-types';

import defaultTheme from './theme.css';

export default function Error({ message, theme, title }) {
  return (
    <div className={theme.wrapper}>
      <div className={theme.container}>
        <span className={theme.icon}>!</span>
        <div>
          <h2 className={theme.title}>{title}</h2>
          <p className={theme.message}>{message}</p>
        </div>
      </div>
    </div>
  );
}

Error.propTypes = {
  message: PropTypes.string,
  theme: PropTypes.shape({}),
  title: PropTypes.string,
};

Error.defaultProps = {
  message:
    'Oh no! Pullp encountered an error. Try refreshing the app with CMD+R or CTRL+R',
  theme: defaultTheme,
  title: 'Error',
};
