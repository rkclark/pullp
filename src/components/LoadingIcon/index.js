import React from 'react';
import PropTypes from 'prop-types';

import defaultTheme from './theme.css';

export default function LoadingIcon({ theme, loading }) {
  return (
    <div className={`${theme.loader} ${loading ? theme.loading : null}`}>
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

LoadingIcon.propTypes = {
  theme: PropTypes.shape({}),
  loading: PropTypes.bool,
};

LoadingIcon.defaultProps = {
  theme: defaultTheme,
  loading: true,
};
