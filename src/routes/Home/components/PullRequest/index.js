import React from 'react';
import PropTypes from 'prop-types';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import defaultTheme from './theme.css';

/* eslint-disable react/no-array-index-key */
export default function PullRequest({
  theme,
  date,
  time,
  url,
  number,
  title,
  author,
  reviewedByCurrentUser,
  currentUserReviewRequested,
  reviewsByAuthor,
  reviewRequests,
}) {
  const reviewRequestStatus = () => {
    if (reviewedByCurrentUser) {
      return (
        <div className={theme.reviewStatusWrapper}>
          <div className={`${theme.reviewStatusIndicator} ${theme.reviewed}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 406.83 406.83"
              width="512"
              height="512"
              className={theme.reviewStatusIcon}
            >
              <path
                fill="#FFFFFF"
                d="M385.62 62.5l-239.4 239.4-125-125L0 198.1l146.22 146.23L406.84 83.72z"
              />
            </svg>
          </div>
          <span className={theme.statusSpan}>You have reviewed</span>
        </div>
      );
    }
    if (currentUserReviewRequested) {
      return (
        <div className={theme.reviewStatusWrapper}>
          <div
            className={`${theme.reviewStatusIndicator} ${
              theme.reviewRequested
            }`}
          >
            <svg className={theme.spinCircle}>
              <circle cx="50%" cy="50%" r="45px" />
            </svg>
            <span className={theme.reviewStatusSpan}>!</span>
          </div>
          <span className={theme.statusSpan}>Your review requested</span>
        </div>
      );
    }

    return (
      <div className={theme.reviewStatusWrapper}>
        <div className={`${theme.reviewStatusIndicator} ${theme.noRequest}`}>
          <svg
            className={theme.reviewStatusIcon}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 31.11 31.11"
          >
            <path
              fill="#FFF"
              d="M31.1 1.4L29.7 0 15.56 14.14 1.4 0 0 1.4l14.14 14.16L0 29.7l1.4 1.4 14.16-14.13L29.7 31.1l1.4-1.4-14.13-14.14"
            />
          </svg>
        </div>
        <span className={theme.statusSpan}>Your review not requested</span>
      </div>
    );
  };

  const generateStateClass = state => {
    let reviewStatusClassName = '';
    switch (state) {
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
    return reviewStatusClassName;
  };

  const prReviews = reviewsByAuthor.map(review => (
    <div className={theme.review} key={`${review.login}`}>
      <img
        className={theme.reviewAuthorAvatar}
        src={review.avatarUrl}
        alt="review author"
      />
      <span className={theme.reviewAuthorLogin}>{review.login}</span>
      {review.states.map((state, index) => {
        const stateClass = generateStateClass(state);
        return (
          <div
            className={`${theme.reviewState} ${theme[stateClass]}`}
            key={`${review.login}_state_${index}`}
          >
            {state.replace(/_/g, ' ')}
          </div>
        );
      })}
    </div>
  ));

  const requestedReviewers = reviewRequests.map(reviewRequest => {
    const name = reviewRequest.requestedReviewer.login
      ? reviewRequest.requestedReviewer.login
      : reviewRequest.requestedReviewer.name;
    return (
      <div
        className={theme.requestedReviewer}
        key={`${name}_${reviewRequest.requestedReviewer.avatarUrl}`}
      >
        <img
          src={reviewRequest.requestedReviewer.avatarUrl}
          alt={`${name} avatar`}
          className={theme.requestedReviewerAvatar}
        />
        <span className={theme.requestedReviewerName}>{name}</span>
      </div>
    );
  });

  return (
    <a href={url} className={theme.link}>
      <div className={`${theme.pullRequest}`}>
        <div className={theme.header}>
          <h4 className={theme.title}>{title}</h4>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className={theme.linkIcon}
          >
            <path
              d="M488.73 0H302.54a23.27 23.27 0 0 0 0 46.55h130L193 286.09A23.27 23.27 0 1 0 225.9 319L465.45 79.46v130a23.27 23.27 0 0 0 46.55 0V23.27A23.27 23.27 0 0 0 488.73 0z"
              fill="#1D2843"
            />
            <path
              d="M395.64 232.73A23.27 23.27 0 0 0 372.36 256v209.46H46.55V139.64H256a23.27 23.27 0 0 0 0-46.55H23.27A23.27 23.27 0 0 0 0 116.36v372.37A23.27 23.27 0 0 0 23.27 512h372.37a23.27 23.27 0 0 0 23.27-23.27V256a23.27 23.27 0 0 0-23.27-23.27z"
              fill="#1D2843"
            />
          </svg>
        </div>
        <div className={theme.bodyWrapper}>
          <div className={theme.leftColumn}>
            <img
              className={theme.authorAvatar}
              src={author.avatarUrl}
              alt="pull request author"
            />
            <span className={theme.authorLogin}>{author.login}</span>
            <span className={theme.infoSpan}>#{number}</span>
            <span className={theme.infoSpan}>
              {distanceInWordsToNow(date)} ago
            </span>
            <span className={theme.infoSpan}>{time}</span>
          </div>
          <div className={theme.middleColumn}>
            {reviewRequestStatus()}
            {reviewRequests.length > 0 ? (
              <h3 className={theme.requestedReviewsTitle}>
                Requested Reviewers
              </h3>
            ) : null}
            <div className={theme.requestedReviewersContainer}>
              {requestedReviewers}
            </div>
          </div>
          <div className={theme.rightColumn}>
            <h3 className={theme.reviewsTitle}>Reviews</h3>
            <div className={theme.reviewsContainer}>
              {prReviews}
              {reviewsByAuthor.length === 0 ? (
                <div className={theme.noReviewsMessage}>
                  <svg
                    className={theme.noReviewsIcon}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 31.11 31.11"
                  >
                    <path
                      fill="#FFF"
                      d="M31.1 1.4L29.7 0 15.56 14.14 1.4 0 0 1.4l14.14 14.16L0 29.7l1.4 1.4 14.16-14.13L29.7 31.1l1.4-1.4-14.13-14.14"
                    />
                  </svg>
                  <span>No reviews submitted</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

PullRequest.propTypes = {
  theme: PropTypes.shape(),
  date: PropTypes.string,
  time: PropTypes.string,
  url: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    login: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  currentUserReviewRequested: PropTypes.bool.isRequired,
  reviewedByCurrentUser: PropTypes.bool.isRequired,
  reviewsByAuthor: PropTypes.arrayOf(PropTypes.shape()),
  reviewRequests: PropTypes.arrayOf(PropTypes.shape()),
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
  reviewsByAuthor: [],
};
