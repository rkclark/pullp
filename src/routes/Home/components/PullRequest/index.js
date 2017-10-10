import React from 'react';
import PropTypes from 'prop-types';
import defaultTheme from './theme.css';
import comment from '../../../../images/comment-white.svg';

/* eslint-disable no-unused-vars */
export default function PullRequest({
  theme,
  date,
  time,
  mergedAt,
  url,
  number,
  title,
  author,
  comments,
  reviewRequests,
  reviews,
  aggregatedReviews,
}) {
  let statusClass = 'statusDefault';
  statusClass =
    reviewRequests.length > 0 && reviews.length === 0
      ? 'statusOutstandingReview'
      : statusClass;

  let status = 'No Review Requested';
  status =
    reviewRequests.length > 0 && reviews.length === 0
      ? 'Review Requested'
      : status;

  const reviewTags = (
    <div className={theme.reviewTagsContainer}>
      {aggregatedReviews
        ? Object.entries(aggregatedReviews).map(reviewStatus => {
            let reviewStatusClassName = '';
            switch (reviewStatus[0]) {
              case 'APPROVED':
                reviewStatusClassName = 'statusApproved';
                break;
              case 'CHANGES_REQUESTED':
                reviewStatusClassName = 'statusChangesRequested';
                break;
              case 'COMMENTED':
                reviewStatusClassName = 'statusCommented';
                break;
              case 'PENDING':
                reviewStatusClassName = 'statusPending';
                break;
              case 'DISMISSED':
                reviewStatusClassName = 'statusDismissed';
                break;
              default:
                reviewStatusClassName = '';
            }
            return (
              <p
                key={reviewStatus[0]}
                className={`${theme.reviewStatus} ${theme[
                  reviewStatusClassName
                ]}`}
              >
                {reviewStatus[0].replace(/_/g, ' ')} x{reviewStatus[1]}
              </p>
            );
          })
        : null}
    </div>
  );

  return (
    <div className={`${theme.pullRequest} ${theme[statusClass]}`}>
      <div className={theme.leftColumn}>
        <a href={url}>
          <h4>
            <span>#{number}</span> {title}
          </h4>
        </a>
        <div className={theme.prInfoContainer}>
          <div>
            <img
              className={theme.authorAvatar}
              src={author.avatarUrl}
              alt="pull request author"
            />
          </div>
          <span className={theme.createdAt}>
            {date} at {time}
          </span>
        </div>
        <a href={author.url} className={theme.authorLogin}>
          {author.login}
        </a>
      </div>
      <div className={theme.middleColumn}>
        <div className={theme.commentContainer}>
          <img src={comment} alt="comment" className={theme.commentIcon} />
          <span className={theme.commentCount} data-test-id="commentCount">
            {comments.length}
          </span>
        </div>
      </div>
      <div className={theme.rightColumn}>
        <div className={theme.mainStatus}>
          <p>{status.toUpperCase()}</p>
        </div>
        {reviewTags}
      </div>
    </div>
  );
}

PullRequest.propTypes = {
  theme: PropTypes.shape(),
  date: PropTypes.string,
  time: PropTypes.string,
  mergedAt: PropTypes.string,
  url: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    login: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  comments: PropTypes.arrayOf(PropTypes.shape()),
  reviewRequests: PropTypes.arrayOf(PropTypes.shape()),
  reviews: PropTypes.arrayOf(PropTypes.shape()),
  aggregatedReviews: PropTypes.shape(),
};

PullRequest.defaultProps = {
  theme: defaultTheme,
  mergedAt: null,
  assignees: [],
  comments: [],
  reviewRequests: [],
  reviews: [],
  aggregatedReviews: {},
  date: null,
  time: null,
};
