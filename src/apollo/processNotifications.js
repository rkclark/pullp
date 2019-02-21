import reviewRequested from './notificationRules/reviewRequested';

const triggerNotification = ({ title, message }) => {
  /* eslint-disable no-new */
  new Notification(title, {
    body: message,
  });
  /* eslint-enable no-new */
};

export default ({
  existingNotifications,
  extendedPullRequest: pullRequest,
}) => {
  const newNotifications = [
    ...reviewRequested({ existingNotifications, pullRequest }),
  ];

  newNotifications.forEach(notification => {
    triggerNotification(notification);
  });

  return [...existingNotifications, ...newNotifications];
};
