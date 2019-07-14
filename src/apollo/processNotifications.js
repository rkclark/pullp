import reviewRequested from './notificationRules/reviewRequested';

const hasElectron = typeof window.electron !== 'undefined';

const triggerNotification = ({ notification: { title, message }, url }) => {
  /* eslint-disable no-new */
  const notification = new Notification(title, {
    body: message,
  });
  /* eslint-enable no-new */

  notification.onclick = event => {
    event.preventDefault(); // Prevent the OS from focusing on Pullp
    hasElectron
      ? window.electron.shell.openExternal(url)
      : window.open(url, '_blank'); // Open the PR url in the user's default browser
  };
};

export default ({
  existingNotifications,
  extendedPullRequest: pullRequest,
}) => {
  const newNotifications = [
    ...reviewRequested({ existingNotifications, pullRequest }),
  ];

  newNotifications.forEach(notification => {
    triggerNotification({ notification, url: pullRequest.url });
  });

  return [...existingNotifications, ...newNotifications];
};
