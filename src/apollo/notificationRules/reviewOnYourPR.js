import { get } from 'lodash';
import { notificationTypes } from '../../constants';

export default ({ existingNotifications, pullRequest, currentUser }) => {
  const newNotifications = [];

  const prAuthor = get(pullRequest, 'author.login');

  if (prAuthor !== currentUser) {
    return newNotifications;
  }

  const hasReviewAlreadyBeenNotified = review =>
    existingNotifications.find(
      notification =>
        notification.type === notificationTypes.REVIEW_ON_YOUR_PR &&
        notification.sourceNodeId === review.id,
    );

  pullRequest.reviews.forEach(review => {
    if (!hasReviewAlreadyBeenNotified(review)) {
      const message = `${get(
        review,
        'author.login',
      )} reviewed your pull request`;
      const title = 'Review On Your PR';

      newNotifications.push({
        type: notificationTypes.REVIEW_ON_YOUR_PR,
        title,
        message,
        sourceNodeId: review.id,
      });
    }
  });

  return newNotifications;
};
