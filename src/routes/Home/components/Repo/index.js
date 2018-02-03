/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react';
import PropTypes from 'prop-types';
import CircularProgressbar from 'react-circular-progressbar';
import defaultTheme from './theme.css';
import RepoModal from '../RepoModal';
import { REPO_SUMMARY_MAX_PRS } from '../../../../constants';
import userIcon from '../../../../images/anon-user.svg';

export default function Repo({ theme, data, toggleOpenRepo, openRepoId }) {
  const numberOfPrs = data.pullRequests.length;

  const spanClass = numberOfPrs > 5 ? 'spanMax' : `span${numberOfPrs + 1}`;

  const countClass = numberOfPrs === 0 ? 'zeroCount' : null;

  const open = data.id === openRepoId;
  const onClick = () => {
    toggleOpenRepo(data.id);
  };

  const openRepo = open ? (
    <div>{<RepoModal data={data} toggleOpenRepo={toggleOpenRepo} />}</div>
  ) : null;

  const prSubset = data.pullRequests.slice(0, REPO_SUMMARY_MAX_PRS);

  const prRows = prSubset.map(pr => (
    <div className={theme.prRow} key={`subset_${data.id}_${pr.number}`}>
      <img
        className={theme.prAvatar}
        src={pr.author.avatarUrl}
        alt="author avatar"
      />
      <span className={theme.prAuthor}>{pr.author.login}</span>
    </div>
  ));

  const extraPrs = numberOfPrs - REPO_SUMMARY_MAX_PRS;
  const extraCount =
    extraPrs > 0 ? (
      <div className={theme.prRow}>
        <img
          src={userIcon}
          alt="user icon"
          className={`${theme.prAvatar} ${theme.userIcon}`}
        />
        <span className={theme.prAuthor}>
          +{extraPrs} more author{`${extraPrs > 1 ? 's' : ''}`}
        </span>
      </div>
    ) : null;

  const reviewCompletionPercentage =
    data.currentUserReviews / numberOfPrs * 100;

  return (
    <div
      className={`${theme.repoContainer} ${theme[spanClass]} ${open
        ? theme.open
        : null}`}
    >
      <div className={`${theme.repo} ${theme[countClass]}`}>
        <a href={data.url} className={theme.link}>
          <h3 className={theme.name}>{data.name}</h3>
        </a>
        <div
          className={theme.indicatorsContainer}
          onClick={onClick}
          role="button"
          tabIndex="0"
        >
          <div className={`${theme.countContainer}`}>
            <div className={`${theme.prCount}`}>
              <span className={theme.countLabel}>
                {data.pullRequests.length}
              </span>
            </div>
            <span className={theme.prCountLabel}>OPEN</span>
            {prRows}
            {extraCount}
          </div>
          {numberOfPrs > 0 ? (
            <div className={theme.reviewsContainer}>
              <div className={theme.reviewCoverageContainer}>
                <CircularProgressbar
                  percentage={reviewCompletionPercentage}
                  className={theme.progressCircle}
                  strokeWidth={20}
                  initialAnimation
                />
                <span
                  className={theme.reviewCoverage}
                >{`${data.currentUserReviews}/${numberOfPrs}`}</span>
              </div>
              <span className={theme.prCountLabel}>Reviewed by you</span>
              <div
                className={`${theme.reviewRequestsContainer} ${data.currentUserReviewRequests ===
                0
                  ? theme.noRequests
                  : null}`}
              >
                <div className={theme.requestsCircle}>
                  <span
                    className={`${theme.requestsCount} ${theme.countLabel}`}
                  >
                    {data.currentUserReviewRequests}
                  </span>
                </div>
                {data.currentUserReviewRequests > 0 ? (
                  <svg className={theme.spinCircle}>
                    <circle cx="50%" cy="50%" r="45px" />
                  </svg>
                ) : null}
              </div>
              <span className={theme.prCountLabel}>
                Requests for your review
              </span>
            </div>
          ) : null}
        </div>
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
