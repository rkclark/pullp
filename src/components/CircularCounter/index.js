import React from 'react';
import PropTypes from 'prop-types';
import defaultTheme from './theme.css';

export default function CircularCounter({ theme, count }) {
  const zeroCountClass = count === 0 ? theme.zeroCount : null;
  return (
    <div className={`${theme.counter} ${zeroCountClass}`}>
      <span className={`${theme.label}`}>{count}</span>
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
