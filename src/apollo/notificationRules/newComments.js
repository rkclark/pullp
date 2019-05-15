import { get } from 'lodash';
import { notificationTypes } from '../../constants';

export default ({ existingNotifications, pullRequest, currentUser }) => {
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

    if (login === currentUser) {
      const title = 'New Comments On Your PR';

      return [
        {
          type: notificationTypes.NEW_COMMENTS_ON_YOUR_PR,
          title,
          message,
          comments: {
            count: latestCount,
            increment,
          },
          sourceNodeId: pullRequestId,
        },
      ];
    }

    const title = 'New Comments On PR';
    return [
      {
        type: notificationTypes.NEW_COMMENTS,
        title,
        message,
        comments: {
          count: latestCount,
          increment,
        },
        sourceNodeId: pullRequestId,
      },
    ];
  }

  return [];
};
