import { get } from 'lodash';
import {
  notificationTypes,
  pullRequestStates,
  stateChangeNotificationSubTypes,
} from '../../constants';

export default ({ existingNotifications, pullRequest, currentUser }) => {
  const prAuthor = get(pullRequest, 'author.login');
  const isUserPRAuthor = currentUser === prAuthor;

  const mostRecentState = existingNotifications.reduce(
    (state, notification) => {
      if (notification.type === notificationTypes.PR_STATE_CHANGE) {
        return notification.subType;
      }

      return state;
    },
    null,
  );

  if (!mostRecentState) {
    const message = `${prAuthor} opened "${pullRequest.title}"`;
    const title = 'New Pull Request';

    return [
      {
        type: notificationTypes.PR_STATE_CHANGE,
        subType: stateChangeNotificationSubTypes.OPENED,
        title,
        message,
        sourceNodeId: pullRequest.id,
      },
    ];
  }

  const pullRequestState = pullRequest.state;

  if (pullRequestState === pullRequestStates.CLOSED) {
    if (mostRecentState !== stateChangeNotificationSubTypes.CLOSED) {
      const message = `"${pullRequest.title}"`;
      const title = `${isUserPRAuthor ? 'Your ' : ''}Pull Request Closed`;

      return [
        {
          type: notificationTypes.PR_STATE_CHANGE,
          subType: stateChangeNotificationSubTypes.CLOSED,
          title,
          message,
          sourceNodeId: pullRequest.id,
        },
      ];
    }
  }

  if (pullRequestState === pullRequestStates.MERGED) {
    if (mostRecentState !== stateChangeNotificationSubTypes.MERGED) {
      const message = `"${pullRequest.title}"`;
      const title = `${isUserPRAuthor ? 'Your ' : ''}Pull Request Merged`;

      return [
        {
          type: notificationTypes.PR_STATE_CHANGE,
          subType: stateChangeNotificationSubTypes.MERGED,
          title,
          message,
          sourceNodeId: pullRequest.id,
        },
      ];
    }
  }

  if (pullRequestState === pullRequestStates.OPEN) {
    if (mostRecentState !== stateChangeNotificationSubTypes.OPENED) {
      const message = `${prAuthor} re-opened "${pullRequest.title}"`;
      const title = 'Pull Request Re-opened';

      return [
        {
          type: notificationTypes.PR_STATE_CHANGE,
          subType: stateChangeNotificationSubTypes.RE_OPENED,
          title,
          message,
          sourceNodeId: pullRequest.id,
        },
      ];
    }
  }

  return [];
};
