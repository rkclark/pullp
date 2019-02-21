import { notificationTypes } from '../constants';

export default ({
  existingNotifications,
  currentUserReviewRequested,
  pullRequest,
}) => {
  const notifications = [];
  const {
    author: { login },
  } = pullRequest;

  const reviewAlreadyRequested = existingNotifications.some(
    ({ type }) => type === notificationTypes.REVIEW_REQUESTED,
  );

  if (!reviewAlreadyRequested) {
    if (currentUserReviewRequested) {
      const message = `${login} requested your review`;

      /* eslint-disable no-new */
      new Notification('Review Requested', {
        body: message,
      });
      /* eslint-enable no-new */

      notifications.push({
        type: notificationTypes.REVIEW_REQUESTED,
        message,
      });
    }
  }

  return [...existingNotifications, ...notifications];
};
