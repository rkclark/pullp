import { get } from 'lodash';
import {
  notificationTypes,
  pullRequestStates,
  stateChangeNotificationSubTypes,
} from '../../constants';

export default ({
  existingNotifications,
  pullRequest,
  currentUser,
  userSettings,
}) => {
  const prAuthor = get(pullRequest, 'author.login');
  const isUserPRAuthor = currentUser === prAuthor;

  const pullRequestState = pullRequest.state;

  const mostRecentState = existingNotifications.reduce(
    (state, notification) => {
      if (notification.type === notificationTypes.PR_STATE_CHANGE) {
        return notification.subType;
      }

      return state;
    },
    null,
  );

  const type = notificationTypes.PR_STATE_CHANGE;

  const baseNotification = {
    type,
    sourceNodeId: pullRequest.id,
    trigger: get(userSettings, `notifications[${type}].trigger`) || false,
    dismissed: false,
    timestamp: new Date().toISOString(),
  };

  /*
    No existing state change notification means this is a newly retrieved
    pull request.

    This can mean either a new PR opened on a selected repository, or that a
    new repository has been selected and it has existing PRs (that may be open, 
    closed or merged).
  */
  if (!mostRecentState) {
    /*
      If the PR is open then it is ok to notify the user.
    */
    if (pullRequestState === pullRequestStates.OPEN) {
      const message = `${prAuthor} opened "${pullRequest.title}"`;
      const title = 'New Pull Request';

      return [
        {
          ...baseNotification,
          subType: stateChangeNotificationSubTypes.OPENED,
          title,
          message,
        },
      ];
    }

    /*
      If the PR is not open then don't notify the user. This is to avoid
      spamming notifications for every single closed and merged pull request
      when the user selects a new repository.
    */
    return [];
  }

  if (pullRequestState === pullRequestStates.CLOSED) {
    if (mostRecentState !== stateChangeNotificationSubTypes.CLOSED) {
      const message = `"${pullRequest.title}"`;
      const title = `${isUserPRAuthor ? 'Your ' : ''}Pull Request Closed`;

      return [
        {
          ...baseNotification,
          subType: stateChangeNotificationSubTypes.CLOSED,
          title,
          message,
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
          ...baseNotification,
          subType: stateChangeNotificationSubTypes.MERGED,
          title,
          message,
        },
      ];
    }
  }

  if (pullRequestState === pullRequestStates.OPEN) {
    if (
      mostRecentState !== stateChangeNotificationSubTypes.OPENED &&
      mostRecentState !== stateChangeNotificationSubTypes.RE_OPENED
    ) {
      const message = `${prAuthor} re-opened "${pullRequest.title}"`;
      const title = 'Pull Request Re-opened';

      return [
        {
          ...baseNotification,
          subType: stateChangeNotificationSubTypes.RE_OPENED,
          title,
          message,
        },
      ];
    }
  }

  return [];
};
