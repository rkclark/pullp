import reviewRequested from './notificationRules/reviewRequested';
import reviewOnYourPR from './notificationRules/reviewOnYourPR';

const { shell } = window.electron;

const triggerNotification = ({ notification: { title, message }, url }) => {
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
}) => {
  const newNotifications = [
    ...reviewRequested({ existingNotifications, pullRequest }),
    ...reviewOnYourPR({ existingNotifications, pullRequest, currentUser }),
  ];

  newNotifications.forEach(notification => {
    triggerNotification({ notification, url: pullRequest.url });
  });

  console.log('new notifications', newNotifications);

  return [...existingNotifications, ...newNotifications];
};
