import reviewRequested from './reviewRequested';
import { notificationTypes } from '../../constants';

const { REVIEW_REQUESTED } = notificationTypes;

const reviewRequestedNotification = {
  type: REVIEW_REQUESTED,
  title: 'Review Requested',
  message: '',
};

describe('reviewRequested', () => {
  describe(`when there is an existing ${REVIEW_REQUESTED} notification`, () => {
    it('does not add a new one', () => {
      const notifications = reviewRequested({
        existingNotifications: [reviewRequestedNotification],
        pullRequest: {},
      });

      expect(notifications.length).toBe(0);
    });
  });

  describe(`when there is no existing ${REVIEW_REQUESTED} notification`, () => {
    describe("when the user's review is requested", () => {
      it('adds a new notification with the correct message', () => {
        const login = 'user';
        const notifications = reviewRequested({
          existingNotifications: [],
          pullRequest: {
            author: {
              login,
            },
            pullpPullRequest: {
              currentUserReviewRequested: true,
            },
          },
        });

        expect(notifications.length).toBe(1);
        const { 0: notification } = notifications;

        expect(notification.type).toBe(REVIEW_REQUESTED);
        expect(notification.title).toBe(reviewRequestedNotification.title);
        expect(notification.message).toBe(`${login} requested your review`);
      });
    });

    describe("when the user's review is not requested", () => {
      it('does not add a new notification', () => {
        const notifications = reviewRequested({
          existingNotifications: [],
          pullRequest: {
            pullpPullRequest: {
              currentUserReviewRequested: false,
            },
          },
        });
        expect(notifications.length).toBe(0);
      });
    });
  });
});
