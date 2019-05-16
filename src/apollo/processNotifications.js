import reviewRequested from './notificationRules/reviewRequested';
import reviewOnYourPR from './notificationRules/reviewOnYourPR';
import pullRequestStateChange from './notificationRules/pullRequestStateChange';
import newComments from './notificationRules/newComments';
import { pullRequestStates } from '../constants';

const { shell } = window.electron;

const closedStates = [pullRequestStates.CLOSED, pullRequestStates.MERGED];

const triggerNotification = ({
  notification: { title, message, trigger },
  url,
}) => {
  if (!trigger) {
    return;
  }

  /* eslint-disable no-new */
  const notification = new Notification(title, {
    body: message,
  });
  /* eslint-enable no-new */

  notification.onclick = event => {
    event.preventDefault(); // Prevent the OS from focusing on Pullp
    shell.openExternal(url); // Open the PR url in the user's default browser
  };
};

export default ({
  existingNotifications,
  extendedPullRequest: pullRequest,
  currentUser,
  userSettings,
}) => {
  /* 
    If a closed/merged pull request has no existing notifications
    then it must have been newly retrieved from Github. Most likely, this is
    due to the user selecting a new repository that has existing closed/merged
    pull requests.

    We do not want to process or trigger notifications for these historical pull
    requests, so we return an empty array.
  */
  if (
    closedStates.includes(pullRequest.state) &&
    existingNotifications.length === 0
  ) {
    return [];
  }

  const baseArgs = {
    existingNotifications,
    pullRequest,
    userSettings,
  };

  const newNotifications = [
    ...newComments({
      ...baseArgs,
      currentUser,
    }),
    ...reviewRequested(baseArgs),
    ...reviewOnYourPR({
      ...baseArgs,
      currentUser,
    }),
    ...pullRequestStateChange({
      ...baseArgs,
      currentUser,
    }),
  ];

  newNotifications.forEach(notification => {
    triggerNotification({ notification, url: pullRequest.url });
  });

  console.log(`${newNotifications.length} new notifications`, newNotifications);

  return [...existingNotifications, ...newNotifications];
};
