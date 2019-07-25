import React from 'react';
import PropTypes from 'prop-types';

export default function FullViewIcon({ theme }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 95.5 95.5"
      className={theme.svg}
    >
      <path d="M39.1 0H2a2 2 0 0 0-2 2v37.1c0 1.1.9 2 2 2h37.1a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM93.5 0H56.4a2 2 0 0 0-2 2v37.1c0 1.1.9 2 2 2h37.1a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM39.1 54.4H2a2 2 0 0 0-2 2v37.1c0 1.1.9 2 2 2h37.1a2 2 0 0 0 2-2V56.4a2 2 0 0 0-2-2zM93.5 54.4H56.4a2 2 0 0 0-2 2v37.1c0 1.1.9 2 2 2h37.1a2 2 0 0 0 2-2V56.4a2 2 0 0 0-2-2z" />
    </svg>
  );
}

FullViewIcon.propTypes = {
  theme: PropTypes.shape({}),
};

FullViewIcon.defaultProps = {
  theme: {},
};
