import React from 'react';
import PropTypes from 'prop-types';

export default function CommentIcon(theme) {
  return (
    <svg
      className={theme.svg}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 27.75 27.75"
    >
      <path d="M13.88 27.75l-4.27-7.4H4.27c-2.2 0-3.98-1.61-3.98-3.6V3.6C.3 1.61 2.08 0 4.27 0h19.2c2.2 0 3.99 1.62 3.99 3.61v13.14c0 1.99-1.79 3.6-3.98 3.6h-5.34l-4.27 7.4zM4.28 2c-1.1 0-1.99.72-1.99 1.61v13.14c0 .89.9 1.6 1.98 1.6h6.49l3.11 5.4 3.11-5.4h6.5c1.09 0 1.97-.72 1.97-1.6V3.6c0-.89-.89-1.61-1.98-1.61H4.27z" />
    </svg>
  );
}

CommentIcon.propTypes = {
  theme: PropTypes.shape({}),
};

CommentIcon.defaultProps = {
  theme: {},
};
