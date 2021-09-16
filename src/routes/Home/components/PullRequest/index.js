import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import Tooltip from 'react-tooltip';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import defaultTheme from './theme.css';
import { DISMISS_NOTIFICATIONS } from '../../../../apollo/mutations';

import TickIcon from '../../../../components/TickIcon';
import CrossIcon from '../../../../components/CrossIcon';
import EllipsisIcon from '../../../../components/EllipsisIcon';
import CommentIcon from '../../../../components/CommentIcon';
import LeftArrowIcon from '../../../../components/LeftArrowIcon';

/* eslint-disable react/no-array-index-key, jsx-a11y/interactive-supports-focus */
export default class PullRequest extends React.Component {
  constructor(props) {
    super();
    this.props = props;
  }

  render() {
    const {
      theme,
      url,
      id,
      number,
      title,
      createdAt,
      author,
      isDraft,
      pullpPullRequest: {
        time,
        currentUserReviewRequested,
        reviewedByCurrentUser,
        reviewsByAuthor,
        newNotificationCount,
      },
      reviewRequests,
      headRefName,
      baseRefName,
      additions,
      deletions,
      comments,
      repoName,
    } = this.props;

    const reviewRequestStatus = () => {
      if (currentUserReviewRequested) {
        return (
          <div
            className={`${theme.reviewStatusIndicator} ${
              theme.reviewRequested
            }`}
            data-tip="Your review requested"
          >
            <span className={theme.reviewStatusSpan}>!</span>
          </div>
        );
      }
      if (reviewedByCurrentUser) {
        return (
          <div
            className={`${theme.reviewStatusIndicator} ${theme.reviewed}`}
            data-tip="You have reviewed"
          >
            <TickIcon theme={{ svg: theme.reviewStatusIcon }} />
          </div>
        );
      }

      return (
        <div className={theme.reviewStatusWrapper}>
          <div
            className={`${theme.reviewStatusIndicator} ${theme.noRequest}`}
            data-tip="Your review not requested"
          >
            <CrossIcon theme={{ svg: theme.reviewStatusIcon }} />
          </div>
        </div>
      );
    };

    const getReviewIcon = ({ state, count, key }) => {
      let icon = '';
      const countText = count > 1 ? <span>x{count}</span> : '';
      switch (state) {
        case 'APPROVED':
          icon = (
            <div
              key={key}
              className={`${theme.reviewIconContainer} ${theme.statusApproved}`}
            >
              <TickIcon />
              {countText}
            </div>
          );
          break;
        case 'CHANGES_REQUESTED':
          icon = (
            <div
              key={key}
              className={`${theme.reviewIconContainer} ${
                theme.statusChangesRequested
              }`}
            >
              <CrossIcon />
              {countText}
            </div>
          );
          break;
        case 'COMMENTED':
          icon = (
            <div
              key={key}
              className={`${theme.reviewIconContainer} ${
                theme.statusCommented
              }`}
            >
              <CommentIcon />
              {countText}
            </div>
          );
          break;
        case 'PENDING':
          icon = (
            <div
              key={key}
              className={`${theme.reviewIconContainer} ${theme.statusPending}`}
            >
              <EllipsisIcon />
              {countText}
            </div>
          );
          break;
        case 'DISMISSED':
          icon = (
            <div
              key={key}
              className={`${theme.reviewIconContainer} ${
                theme.statusDismissed
              }`}
            >
              <CrossIcon />
              {countText}
            </div>
          );
          break;
        default:
          icon = '';
      }
      return icon;
    };

    const getReviewIcons = ({ states, login }) => {
      const consolidatedReviewStates = [];

      states.reduce((previous, state, index) => {
        if (previous.state === state) {
          const consolidatedState = {
            ...previous,
            count: previous.count + 1,
          };

          if (index === states.length - 1) {
            consolidatedReviewStates.push(consolidatedState);
          }
          return consolidatedState;
        }

        consolidatedReviewStates.push(previous);

        if (index === states.length - 1) {
          consolidatedReviewStates.push({ state, count: 1 });
        }

        return { state, count: 1 };
      }, {});

      const reviewIcons = consolidatedReviewStates.map(
        ({ state, count }, index) =>
          getReviewIcon({ state, count, key: `${login}_state_${index}` }),
      );

      return reviewIcons;
    };

    const prReviews = reviewsByAuthor.map(review => (
      <div className={theme.review} key={`${review.login}`}>
        <div className={theme.reviewTopRow}>
          <img
            className={theme.reviewAuthorAvatar}
            src={review.avatarUrl}
            alt="review author"
          />
          <div className={theme.reviewIcons}>{getReviewIcons(review)}</div>
        </div>
        <div className={theme.reviewBottomRow}>
          <span className={theme.reviewAuthorLogin}>{review.login}</span>
        </div>
      </div>
    ));

    const numberOfReviewRequests = reviewRequests.length;

    return (
      <Mutation
        mutation={DISMISS_NOTIFICATIONS}
        variables={{
          pullRequestId: id,
        }}
      >
        {dismissNotifications => (
          <div
            className={`${theme.pullRequestOuterContainer}  ${isDraft &&
              theme.draft}`}
          >
            <Tooltip
              delayShow={700}
              className={theme.tooltip}
              place="bottom"
              effect="solid"
            />
            <span
              className={`${theme.notificationCount} ${newNotificationCount ===
                0 && theme.zeroNotifications}`}
              onClick={dismissNotifications}
              role="button"
              data-tip="Dismiss notifications"
            >
              {newNotificationCount}
              <div className={theme.dismissNotifications}>
                <CrossIcon theme={{ svg: theme.reviewStatusIcon }} />
              </div>
            </span>
            {reviewRequestStatus()}

            <div className={`${theme.pullRequestInnerContainer}`}>
              <a
                href={url}
                className={theme.link}
                onClick={dismissNotifications}
              >
                <div className={theme.linkIconContainer}>
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
                <div className={theme.header}>
                  <h4 className={theme.title}>
                    {isDraft ? (
                      <span className={theme.draftTitle}>[Draft] </span>
                    ) : (
                      ''
                    )}
                    {title}
                  </h4>
                </div>
                {repoName && (
                  <div className={theme.repoName}>
                    <h3>{repoName}</h3>
                  </div>
                )}
                <div className={theme.topRow}>
                  <div className={theme.leftColumn}>
                    <img
                      className={theme.authorAvatar}
                      src={author.avatarUrl}
                      alt="pull request author"
                    />
                    <span className={theme.authorLogin}>{author.login}</span>
                  </div>
                  <div className={theme.middleColumn}>
                    <div className={theme.branchInfoContainer}>
                      <div className={theme.branchInfo}>
                        <span>{baseRefName}</span>
                        <LeftArrowIcon />
                        <span>{headRefName}</span>
                      </div>
                    </div>
                    <div className={theme.reviewRequests}>
                      {numberOfReviewRequests} review request{numberOfReviewRequests !==
                        1 && 's'}
                    </div>
                    <div className={theme.comments}>
                      {comments.totalCount}
                      <CommentIcon />
                    </div>
                  </div>
                </div>
                <div className={theme.bottomRow}>
                  <h3 className={theme.reviewsTitle}>Reviews</h3>
                  <div className={theme.reviewsContainer}>
                    {prReviews}
                    {reviewsByAuthor.length === 0 && (
                      <div className={theme.noReviewsMessage}>
                        None submitted
                      </div>
                    )}
                  </div>
                </div>
                <div className={theme.footer}>
                  <span className={theme.infoSpan}>#{number}</span>
                  <span className={theme.infoSpan}>
                    {distanceInWordsToNow(createdAt)} ago
                  </span>
                  <span className={theme.infoSpan}>{time}</span>
                  <div className={theme.lineChangesInfo}>
                    <span className={theme.additions}>+ {additions}</span>
                    <span className={theme.deletions}>- {deletions}</span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        )}
      </Mutation>
    );
  }
}

PullRequest.propTypes = {
  theme: PropTypes.shape(),
  comments: PropTypes.shape(),
  url: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  isDraft: PropTypes.bool,
  author: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    login: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  reviewRequests: PropTypes.arrayOf(PropTypes.shape()),
  pullpPullRequest: PropTypes.shape({
    date: PropTypes.string,
    time: PropTypes.string,
    currentUserReviewRequested: PropTypes.bool.isRequired,
    reviewedByCurrentUser: PropTypes.bool.isRequired,
    reviewsByAuthor: PropTypes.arrayOf(PropTypes.shape()),
  }),
  baseRefName: PropTypes.string,
  headRefName: PropTypes.string,
  additions: PropTypes.number,
  deletions: PropTypes.number,
  repoName: PropTypes.string,
};

PullRequest.defaultProps = {
  theme: defaultTheme,
  isDraft: false,
  mergedAt: null,
  comments: {},
  assignees: [],
  reviewRequests: [],
  reviews: [],
  pullpPullRequest: {
    date: null,
    time: null,
    reviewsByAuthor: [],
  },
  baseRefName: '',
  headRefName: '',
  additions: 0,
  deletions: 0,
  repoName: null,
};
