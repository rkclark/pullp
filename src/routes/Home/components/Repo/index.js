/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import CircularProgressbar from 'react-circular-progressbar';

import defaultTheme from './theme.css';
// import RepoModal from '../RepoModal';
import CircularCounter from '../../../../components/CircularCounter';
import { REPO_SUMMARY_MAX_PRS, MAXIMUM_PRS } from '../../../../constants';
import userIcon from '../../../../images/anon-user.svg';

/* This must be a class-based component for React Flip Move animations to work */
export default class Repo extends React.Component {
  constructor(props) {
    super();
    this.props = props;
  }

  render() {
    const { theme, data, toggleOpenRepo } = this.props;
    const numberOfPrs = data.pullRequests.length;
    const totalPrs = data.totalPullRequests;
    const countClass = numberOfPrs === 0 ? 'zeroCount' : null;
    const newNotificationCount = data.newNotificationCount;

    if (data.name.includes('test-repo')) {
      console.log('data is', data);
    }

    const onClick = () => {
      toggleOpenRepo(data.id);
    };

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
          <span className={theme.prAuthor}>+{extraPrs} more</span>
        </div>
      ) : null;

    const reviewCompletionPercentage =
      data.currentUserReviews / numberOfPrs * 100;

    const notShownPrs = totalPrs - MAXIMUM_PRS;

    const maxPrWarning =
      totalPrs > MAXIMUM_PRS ? (
        <div className={theme.maxPrWarning} data-test-id="maxPrWarning">
          <span className={theme.warningIcon}>!</span>
          <span>
            {notShownPrs} additional pull request{notShownPrs > 1 ? 's' : ''}{' '}
            not shown
          </span>
        </div>
      ) : null;

    return (
      <div className={`${theme.repoContainer} ${theme[countClass]}`}>
        <span className={theme.notificationCount}>{newNotificationCount}</span>
        <div className={`${theme.repo}`}>
          <a href={data.url} className={theme.link}>
            <img
              className={theme.ownerAvatar}
              src={data.owner.avatarUrl}
              alt={`${data.owner.login} avatar`}
            />
            <h3 className={theme.name}>{data.name}</h3>
          </a>
          <div
            className={theme.indicatorsContainer}
            onClick={onClick}
            role="button"
            tabIndex="0"
          >
            {numberOfPrs > 0 ? (
              <Fragment>
                <div className={`${theme.countContainer}`}>
                  <CircularCounter count={data.pullRequests.length} />
                  <span className={theme.prCountLabel}>OPEN</span>
                  <div className={theme.authorsContainer}>
                    {prRows}
                    {extraCount}
                  </div>
                </div>
                <div className={theme.reviewsContainer}>
                  <div className={theme.reviewCoverageContainer}>
                    <CircularProgressbar
                      percentage={reviewCompletionPercentage}
                      className={theme.progressCircle}
                      strokeWidth={20}
                      initialAnimation
                    />
                    <span className={theme.reviewCoverage}>{`${
                      data.currentUserReviews
                    }/${numberOfPrs}`}</span>
                  </div>
                  <span className={theme.prCountLabel}>Reviewed by you</span>
                  <div
                    className={`${theme.reviewRequestsContainer} ${
                      data.currentUserReviewRequests === 0
                        ? theme.noRequests
                        : null
                    }`}
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
                    Request{data.currentUserReviewRequests === 1 ? '' : 's'} for
                    your review
                  </span>
                </div>
              </Fragment>
            ) : (
              <div className={theme.zeroCountContainer}>
                <p>None open</p>
              </div>
            )}
          </div>
          {maxPrWarning}
        </div>
      </div>
    );
  }
}

Repo.propTypes = {
  theme: PropTypes.shape(),
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    owner: PropTypes.shape({
      login: PropTypes.string.isRequired,
      avatarUrl: PropTypes.string.isRequired,
    }).isRequired,
    pullRequests: PropTypes.arrayOf(PropTypes.shape()),
  }).isRequired,
  toggleOpenRepo: PropTypes.func.isRequired,
};

Repo.defaultProps = {
  theme: defaultTheme,
  openRepoId: null,
};
