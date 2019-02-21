import { get } from 'lodash';
import { notificationTypes } from '../../constants';

export default ({ existingNotifications, pullRequest }) => {
  const login = get(pullRequest, 'author.login');
  const currentUserReviewRequested = get(
    pullRequest,
    'pullpPullRequest.currentUserReviewRequested',
  );

  const reviewAlreadyRequested = existingNotifications.some(
    ({ type }) => type === notificationTypes.REVIEW_REQUESTED,
  );

  if (!reviewAlreadyRequested && currentUserReviewRequested) {
    const message = `${login} requested your review`;
    const title = 'Review Requested';

    return [
      {
        type: notificationTypes.REVIEW_REQUESTED,
        title,
        message,
      },
    ];
  }

  return [];
};
