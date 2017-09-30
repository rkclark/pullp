import React from 'react';
import PropTypes from 'prop-types';
import defaultTheme from './theme.css';
/* eslint-disable */
export default function PullRequest({
  theme,
  createdAt,
  mergedAt,
  url,
  number,
  title,
  assignees,
  author,
  participants,
  reviewRequests,
  reviews,
}) {
  return (
    <div className={theme.pullRequest}>
      <a href={url}><h4>
        {title}
      </h4></a>
      <span>
        {createdAt}
      </span>
    </div>
  );
}

PullRequest.propTypes = {
  theme: PropTypes.shape(),
  createdAt: PropTypes.string.isRequired,
  mergedAt: PropTypes.string,
  url: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  assignees: PropTypes.arrayOf(PropTypes.shape()),
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
};
