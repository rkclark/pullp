import React from 'react';
import PropTypes from 'prop-types';

export default function TickIcon({ theme }) {
  return (
    <svg
      className={theme.svg}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 612 612"
    >
      <path d="M595.6 81.55a56.03 56.03 0 0 0-79.25 0L183.03 414.87 94.4 338.74a55.3 55.3 0 0 0-78.2 78.2l132.4 113.74a55.3 55.3 0 0 0 78.21 0 55.88 55.88 0 0 0 5.72-6.99c.32-.3.67-.5.99-.8l362.08-362.1a56.04 56.04 0 0 0 0-79.24z" />
    </svg>
  );
}

TickIcon.propTypes = {
  theme: PropTypes.shape({}),
};

TickIcon.defaultProps = {
  theme: {},
};
