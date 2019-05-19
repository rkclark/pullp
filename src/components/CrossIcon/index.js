import React from 'react';
import PropTypes from 'prop-types';

export default function CrossIcon({ theme }) {
  return (
    <svg
      className={theme.svg}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 47.97 47.97"
    >
      <path
        fill="#fff"
        d="M28.23 23.99L47.09 5.12A3 3 0 1 0 42.85.88L23.99 19.74 5.12.88A3 3 0 1 0 .88 5.12L19.74 24 .88 42.85a3 3 0 1 0 4.24 4.24L24 28.23l18.86 18.86a3 3 0 0 0 4.24 0 3 3 0 0 0 0-4.24L28.23 23.99z"
      />
    </svg>
  );
}

CrossIcon.propTypes = {
  theme: PropTypes.shape({}),
};

CrossIcon.defaultProps = {
  theme: {},
};
