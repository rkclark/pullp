/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react';
import PropTypes from 'prop-types';
import defaultTheme from './theme.css';
import PullRequest from '../PullRequest';

export default function RepoModal({ theme, data, toggleOpenRepo }) {
  const onClick = () => {
    toggleOpenRepo(null);
  };

  const closeIcon = (
    <svg
      className={theme.closeIcon}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 31.11 31.11"
    >
      <path
        fill="#FFF"
        d="M31.1 1.4L29.7 0 15.56 14.14 1.4 0 0 1.4l14.14 14.16L0 29.7l1.4 1.4 14.16-14.13L29.7 31.1l1.4-1.4-14.13-14.14"
      />
    </svg>
  );

  return (
    <div>
      <div className={theme.repoContainer}>
        <div className={theme.repo}>
          <div className={theme.repoHeader}>
            <a href={data.url}>
              <h3>{data.name}</h3>
            </a>
            <button
              className={theme.closeButton}
              data-test-id={'closeButton'}
              onClick={onClick}
            >
              {closeIcon}
            </button>
          </div>
          <div className={theme.prsContainer}>
            {data.pullRequests.map(pr => (
              <PullRequest {...pr} key={`${data.id}_${pr.number}`} />
            ))}
          </div>
        </div>
      </div>
      <div className={theme.overlayContainer}>
        <div
          className={theme.overlay}
          data-test-id={'overlay'}
          onClick={onClick}
        />
      </div>
    </div>
  );
}

RepoModal.propTypes = {
  theme: PropTypes.shape(),
  data: PropTypes.shape({
    name: PropTypes.string,
    pullRequests: PropTypes.arrayOf(PropTypes.shape()),
  }).isRequired,
  toggleOpenRepo: PropTypes.func.isRequired,
};

RepoModal.defaultProps = {
  theme: defaultTheme,
  openRepoId: null,
};
