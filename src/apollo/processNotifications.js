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
      notifications.push({
        type: notificationTypes.REVIEW_REQUESTED,
        message: `${login} requested your review`,
      });
    }
  }

  return [...existingNotifications, ...notifications];
};
