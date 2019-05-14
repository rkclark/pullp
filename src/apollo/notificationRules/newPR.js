import { get } from 'lodash';
import { notificationTypes } from '../../constants';

export default ({ existingNotifications, pullRequest, currentUser }) => {
  const newNotifications = [];

  const prAuthor = get(pullRequest, 'author.login');

  if (prAuthor === currentUser) {
    return newNotifications;
  }

  const hasPROpeningAlreadyBeenNotified = () =>
    existingNotifications.find(
      notification => notification.type === notificationTypes.NEW_PR,
    );

  if (!hasPROpeningAlreadyBeenNotified()) {
    const message = `${get(pullRequest, 'author.login')} opened "${
      pullRequest.title
    }"`;
    const title = 'New Pull Request';

    newNotifications.push({
      type: notificationTypes.NEW_PR,
      title,
      message,
      sourceNodeId: pullRequest.id,
    });
  }

  return newNotifications;
};
