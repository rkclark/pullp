import React from 'react';
import PropTypes from 'prop-types';

export default function TickIcon({ theme }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 406.83 406.83"
      width="512"
      height="512"
      className={theme.svg}
    >
      <path
        fill="#0f0d1d"
        d="M385.62 62.5l-239.4 239.4-125-125L0 198.1l146.22 146.23L406.84 83.72z"
      />
    </svg>
  );
}

TickIcon.propTypes = {
  theme: PropTypes.shape({}),
};

TickIcon.defaultProps = {
  theme: {},
};
