import React from 'react';
import PropTypes from 'prop-types';
import defaultTheme from './theme.css';
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
  participants,
  reviewRequests,
  reviews,
}) {
  let status = 'statusDefault';
  status =
    reviewRequests.length > 0 && reviews.length === 0
      ? 'statusOutstandingReview'
      : status;

  return (
    <div className={`${theme.pullRequest} ${theme.status}`}>
      <div className={theme.leftColumn}>
        <a href={url}>
          <h4>
            <span>#{number}</span> {title}
          </h4>
        </a>
      </div>
      <div className={theme.rightColumn}>
        <div>
          <img
            className={theme.authorAvatar}
            src={author.avatarUrl}
            alt="pull request author"
          />
          <a href={author.url}>{author.login}</a>
        </div>
        <span>
          {date} at {time}
        </span>
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
  participants: PropTypes.arrayOf(
    PropTypes.shape({
      avatarUrl: PropTypes.string.isRequired,
      login: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ),
  reviewRequests: PropTypes.arrayOf(PropTypes.shape()),
  reviews: PropTypes.arrayOf(PropTypes.shape()),
};

PullRequest.defaultProps = {
  theme: defaultTheme,
  mergedAt: null,
  assignees: [],
  participants: [],
  reviewRequests: [],
  reviews: [],
  date: null,
  time: null,
};
