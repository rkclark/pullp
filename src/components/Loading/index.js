import React from 'react';
import PropTypes from 'prop-types';

import defaultTheme from './theme.css';

export default function Loading({ theme, loading }) {
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

Loading.propTypes = {
  theme: PropTypes.shape({}),
  loading: PropTypes.bool,
};

Loading.defaultProps = {
  theme: defaultTheme,
  loading: true,
};
