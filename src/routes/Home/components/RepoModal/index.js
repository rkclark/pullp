/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react';
import PropTypes from 'prop-types';
import defaultTheme from './theme.css';
import PullRequest from '../PullRequest';
import closeIcon from '../../../../images/close-white.svg';

export default function RepoModal({ theme, data, toggleOpenRepo }) {
  const onClick = () => {
    toggleOpenRepo(null);
  };

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
              <img
                className={theme.closeIcon}
                src={closeIcon}
                alt="close icon"
              />
            </button>
          </div>
          {data.pullRequests.map(pr => (
            <PullRequest {...pr} key={`${data.id}_${pr.number}`} />
          ))}
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
