import React from 'react';
import PropTypes from 'prop-types';

export default function UserIcon({ theme }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="512"
      height="512"
      viewBox="0 0 409.17 409.16"
      className={theme.svg}
    >
      <g>
        <path d="M204.58 216.67c50.67 0 91.74-48.07 91.74-107.38 0-82.23-41.07-107.37-91.74-107.37-50.67 0-91.74 25.14-91.74 107.37 0 59.3 41.08 107.38 91.74 107.38zM407.16 374.72l-46.28-104.27a23.23 23.23 0 0 0-10.46-11.13l-71.83-37.4a4.63 4.63 0 0 0-4.93.42c-20.32 15.37-44.2 23.49-69.08 23.49-24.87 0-48.76-8.12-69.07-23.5a4.64 4.64 0 0 0-4.93-.4l-71.83 37.39a23.22 23.22 0 0 0-10.46 11.13L2 374.72a23.06 23.06 0 0 0 1.75 22 23.06 23.06 0 0 0 19.4 10.53h362.86c7.87 0 15.12-3.94 19.4-10.53a23.06 23.06 0 0 0 1.75-22z" />
      </g>
    </svg>
  );
}

UserIcon.propTypes = {
  theme: PropTypes.shape({}),
};

UserIcon.defaultProps = {
  theme: {},
};
