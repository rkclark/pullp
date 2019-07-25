import React from 'react';
import PropTypes from 'prop-types';

export default function FullViewIcon({ theme }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 318 318"
      className={theme.svg}
    >
      <path d="M68 3H15A15 15 0 0 0 0 18v53a15 15 0 0 0 15 15h53a15 15 0 0 0 15-15V18A15 15 0 0 0 68 3zM185 3h-53a15 15 0 0 0-15 15v53a15 15 0 0 0 15 15h53a15 15 0 0 0 15-15V18a15 15 0 0 0-15-15zM303 3h-53a15 15 0 0 0-15 15v53a15 15 0 0 0 15 15h53a15 15 0 0 0 15-15V18a15 15 0 0 0-15-15zM68 117H15a15 15 0 0 0-15 15v53a15 15 0 0 0 15 15h53a15 15 0 0 0 15-15v-53a15 15 0 0 0-15-15zM185 117h-53a15 15 0 0 0-15 15v53a15 15 0 0 0 15 15h53a15 15 0 0 0 15-15v-53a15 15 0 0 0-15-15zM303 117h-53a15 15 0 0 0-15 15v53a15 15 0 0 0 15 15h53a15 15 0 0 0 15-15v-53a15 15 0 0 0-15-15zM68 232H15a15 15 0 0 0-15 15v53a15 15 0 0 0 15 15h53a15 15 0 0 0 15-15v-53a15 15 0 0 0-15-15zM185 232h-53a15 15 0 0 0-15 15v53a15 15 0 0 0 15 15h53a15 15 0 0 0 15-15v-53a15 15 0 0 0-15-15zM303 232h-53a15 15 0 0 0-15 15v53a15 15 0 0 0 15 15h53a15 15 0 0 0 15-15v-53a15 15 0 0 0-15-15z" />
    </svg>
  );
}

FullViewIcon.propTypes = {
  theme: PropTypes.shape({}),
};

FullViewIcon.defaultProps = {
  theme: {},
};
