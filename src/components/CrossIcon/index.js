import React from 'react';
import PropTypes from 'prop-types';

export default function CrossIcon({ theme }) {
  return (
    <svg
      className={theme.svg}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 31.11 31.11"
    >
      <path
        fill="#FFF"
        d="M31.1 1.4L29.7 0 15.56 14.14 1.4 0 0 1.4l14.14 14.16L0 29.7l1.4 1.4 14.16-14.13L29.7 31.1l1.4-1.4-14.13-14.14"
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
