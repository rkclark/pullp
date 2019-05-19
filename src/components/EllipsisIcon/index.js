import React from 'react';
import PropTypes from 'prop-types';

export default function EllipsisIcon(theme) {
  return (
    <svg
      className={theme.svg}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 210 210"
    >
      <path d="M25 80C11.21 80 0 91.22 0 105s11.21 25 25 25 25-11.21 25-25-11.22-25-25-25zM105 80c-13.79 0-25 11.21-25 25s11.21 25 25 25 25-11.21 25-25-11.22-25-25-25zM185 80c-13.79 0-25 11.21-25 25s11.21 25 25 25 25-11.21 25-25-11.22-25-25-25z" />
    </svg>
  );
}

EllipsisIcon.propTypes = {
  theme: PropTypes.shape({}),
};

EllipsisIcon.defaultProps = {
  theme: {},
};
