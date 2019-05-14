import { get } from 'lodash';
import {
  notificationTypes,
  pullRequestStates,
  stateChangeNotificationSubTypes,
} from '../../constants';

export default ({ existingNotifications, pullRequest, currentUser }) => {
  const newNotifications = [];

  const prAuthor = get(pullRequest, 'author.login');

  if (
    prAuthor === currentUser ||
    pullRequest.state !== pullRequestStates.OPEN
  ) {
    return newNotifications;
  }

  const hasPROpeningAlreadyBeenNotified = () =>
    existingNotifications.find(
      notification => notification.type === notificationTypes.PR_STATE_CHANGE,
    );

  if (!hasPROpeningAlreadyBeenNotified()) {
    const message = `${get(pullRequest, 'author.login')} opened "${
      pullRequest.title
    }"`;
    const title = 'New Pull Request';

    newNotifications.push({
      type: notificationTypes.PR_STATE_CHANGE,
      subType: stateChangeNotificationSubTypes.OPENED,
      title,
      message,
      sourceNodeId: pullRequest.id,
    });
  }

  return newNotifications;
};
