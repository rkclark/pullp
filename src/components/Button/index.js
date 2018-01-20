import React from 'react';
import PropTypes from 'prop-types';

import defaultTheme from './theme.css';

export default function Button({ onClick, theme, children }) {
  return (
    <button className={theme.button} onClick={onClick}>
      {children}
    </button>
  );
}

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
  theme: PropTypes.shape({}),
};

Button.defaultProps = {
  onClick: () => {},
  children: null,
  theme: defaultTheme,
};
