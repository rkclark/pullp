import React from 'react';
import PropTypes from 'prop-types';

import defaultTheme from './theme.css';

export default function Loading({ theme }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="30"
      viewBox="0 0 24 30"
      className={theme.icon}
    >
      <path fill="#333" d="M0 0h4v10H0z">
        <animateTransform
          attributeType="xml"
          attributeName="transform"
          type="translate"
          values="0 0; 0 20; 0 0"
          begin="0"
          dur="0.6s"
          repeatCount="indefinite"
        />
      </path>
      <path fill="#333" d="M10 0h4v10h-4z">
        <animateTransform
          attributeType="xml"
          attributeName="transform"
          type="translate"
          values="0 0; 0 20; 0 0"
          begin="0.2s"
          dur="0.6s"
          repeatCount="indefinite"
        />
      </path>
      <path fill="#333" d="M20 0h4v10h-4z">
        <animateTransform
          attributeType="xml"
          attributeName="transform"
          type="translate"
          values="0 0; 0 20; 0 0"
          begin="0.4s"
          dur="0.6s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}

Loading.propTypes = {
  theme: PropTypes.shape({}),
};

Loading.defaultProps = {
  theme: defaultTheme,
};
