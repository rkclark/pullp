import { get } from 'lodash';
import { notificationTypes } from '../../constants';

export default ({ existingNotifications, pullRequest }) => {
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

    return [
      {
        type: notificationTypes.REVIEW_REQUESTED,
        title,
        message,
        sourceNodeId: userReviewRequestId,
      },
    ];
  }

  return [];
};
