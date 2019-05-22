import { get } from 'lodash';
import { notificationTypes } from '../../constants';

export default ({ existingNotifications, pullRequest, userSettings }) => {
  const login = get(pullRequest, 'author.login');
  const userReviewRequestId = get(
    pullRequest,
    'pullpPullRequest.userReviewRequestId',
  );

  if (!userReviewRequestId) {
    return [];
  }

  const hasReviewRequestAlreadyBeenNotified = requestId =>
    existingNotifications.find(
      notification =>
        notification.type === notificationTypes.REVIEW_REQUESTED &&
        notification.sourceNodeId === requestId,
    );

  if (!hasReviewRequestAlreadyBeenNotified(userReviewRequestId)) {
    const message = `${login} requested your review`;
    const title = 'Review Requested';
    const type = notificationTypes.REVIEW_REQUESTED;

    return [
      {
        type,
        title,
        message,
        sourceNodeId: userReviewRequestId,
        trigger: get(userSettings, `notifications[${type}].trigger`) || false,
        dismissed: false,
        timestamp: new Date().toISOString(),
      },
    ];
  }

  return [];
};
