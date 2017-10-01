/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react';
import PropTypes from 'prop-types';
import defaultTheme from './theme.css';
import RepoModal from '../RepoModal';

export default function Repo({ theme, data, toggleOpenRepo, openRepoId }) {
  let spanClass = '';
  if (data.pullRequests.length > 5) {
    spanClass = 'spanMax';
  } else {
    spanClass = `span${data.pullRequests.length + 1}`;
  }

  const open = data.id === openRepoId;
  const onClick = () => {
    toggleOpenRepo(data.id);
  };

  const openRepo = open ? (
    <div>{<RepoModal data={data} toggleOpenRepo={toggleOpenRepo} />}</div>
  ) : null;

  return (
    <div
      className={`${theme.repoContainer} ${theme[spanClass]} ${open
        ? theme.open
        : null}`}
    >
      <div className={theme.repo} onClick={onClick} data-test-id="repo">
        <a href={data.url} alt="repo url">
          <h3>{data.name}</h3>
        </a>
        <span>{data.pullRequests.length}</span>
      </div>
      {openRepo}
    </div>
  );
}

Repo.propTypes = {
  theme: PropTypes.shape(),
  data: PropTypes.shape({
    name: PropTypes.string,
    pullRequests: PropTypes.arrayOf(PropTypes.shape()),
  }).isRequired,
  openRepoId: PropTypes.string,
  toggleOpenRepo: PropTypes.func.isRequired,
};

Repo.defaultProps = {
  theme: defaultTheme,
  openRepoId: null,
};
