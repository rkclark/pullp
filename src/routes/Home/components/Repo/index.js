import React from 'react';
import PropTypes from 'prop-types';
import defaultTheme from './theme.css';

export default function Repo({ theme, data }) {
  const doubleSpan = data.pullRequests.length > 0;
  return (
    <div className={`${theme.repo} ${doubleSpan ? theme.doubleSpan : null}`}>
      <h3>{data.name}</h3>
      <span>{data.pullRequests.length}</span>
    </div>
  );
}

Repo.propTypes = {
  theme: PropTypes.shape(),
  data: PropTypes.shape({
    name: PropTypes.string,
    pullRequests: PropTypes.arrayOf(PropTypes.shape()),
  }).isRequired,
};

Repo.defaultProps = {
  theme: defaultTheme,
};
