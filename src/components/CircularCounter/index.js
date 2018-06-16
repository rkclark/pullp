import React from 'react';
import PropTypes from 'prop-types';
import defaultTheme from './theme.css';

export default function CircularCounter({ theme, count }) {
  return (
    <div className={`${theme.counter}`}>
      <span className={theme.label}>{count}</span>
    </div>
  );
}

CircularCounter.propTypes = {
  theme: PropTypes.shape({}),
  count: PropTypes.number.isRequired,
};

CircularCounter.defaultProps = {
  theme: defaultTheme,
};
