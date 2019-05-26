import { get } from 'lodash';
import { notificationTypes } from '../../constants';

export default ({
  existingNotifications,
  pullRequest,
  currentUser,
  userSettings,
}) => {
  const login = get(pullRequest, 'author.login');
  const latestCount = get(pullRequest, 'comments.totalCount') || 0;
  const pullRequestId = pullRequest.id;
  const pullRequestTitle = pullRequest.title;

  const commentNotificationTypes = [
    notificationTypes.NEW_COMMENTS,
    notificationTypes.NEW_COMMENTS_ON_YOUR_PR,
  ];

  const getMostRecentlyNotifiedCommentCount = () =>
    existingNotifications.reduce((count, notification) => {
      if (commentNotificationTypes.includes(notification.type)) {
        const newCount = get(notification, 'comments.count') || 0;
        if (newCount > count) {
          return newCount;
        }
      }
      return count;
    }, 0);

  const previousCount = getMostRecentlyNotifiedCommentCount();

  if (previousCount < latestCount) {
    const increment = latestCount - previousCount;
    const message = `${increment} new comment${
      increment > 1 ? 's' : ''
    } on "${pullRequestTitle}"`;

    const baseNotification = {
      message,
      sourceNodeId: pullRequestId,
      comments: {
        count: latestCount,
        increment,
        __typename: 'PullpNotificationCommentCount',
      },
      dismissed: false,
      timestamp: new Date().toISOString(),
    };

    if (login === currentUser) {
      const title = 'New Comments On Your PR';
      const type = notificationTypes.NEW_COMMENTS_ON_YOUR_PR;

      return [
        {
          ...baseNotification,
          type,
          title,
          trigger: get(userSettings, `notifications[${type}].trigger`) || false,
        },
      ];
    }

    const title = 'New Comments On PR';
    const type = notificationTypes.NEW_COMMENTS;

    return [
      {
        ...baseNotification,
        type,
        title,
        trigger: get(userSettings, `notifications[${type}].trigger`) || false,
      },
    ];
  }

  return [];
};
