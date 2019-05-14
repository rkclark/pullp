import processNotifications from './processNotifications';
import { notificationTypes } from '../constants';
import reviewRequested from './notificationRules/reviewRequested';
import reviewOnYourPR from './notificationRules/reviewOnYourPR';
import newPR from './notificationRules/newPR';

jest.mock('./notificationRules/reviewRequested');
jest.mock('./notificationRules/reviewOnYourPR');
jest.mock('./notificationRules/newPR');

describe('processNotifications', () => {
  const notificationMock = jest.fn(() => ({}));

  beforeAll(() => {
    window.Notification = notificationMock;
  });

  beforeEach(() => {
    reviewRequested.mockReturnValue([]);
    reviewOnYourPR.mockReturnValue([]);
    newPR.mockReturnValue([]);
  });

  afterEach(() => {
    reviewRequested.mockReset();
    reviewOnYourPR.mockReset();
    newPR.mockReset();
    notificationMock.mockClear();
  });

  describe('rule processing', () => {
    const existingNotifications = [{ type: 'NOTIFICATION_TYPE' }];
    const extendedPullRequest = { id: '12345' };
    const currentUser = 'dev';

    const rules = [
      {
        name: 'reviewRequested',
        fn: reviewRequested,
        requiredArgs: {
          existingNotifications,
          pullRequest: extendedPullRequest,
        },
      },
      {
        name: 'reviewOnYourPR',
        fn: reviewOnYourPR,
        requiredArgs: {
          existingNotifications,
          pullRequest: extendedPullRequest,
          currentUser,
        },
      },
      {
        name: 'newPR',
        fn: newPR,
        requiredArgs: {
          existingNotifications,
          pullRequest: extendedPullRequest,
          currentUser,
        },
      },
    ];

    rules.forEach(({ name, fn, requiredArgs }) => {
      it('calls the rule with the required arguments', () => {
        processNotifications({
          existingNotifications,
          extendedPullRequest,
          currentUser,
        });

        expect(fn).toHaveBeenCalledWith(requiredArgs);
      });

      describe(`when the ${name} rule returns a new notification`, () => {
        it('triggers the notification', () => {
          const message = 'message';
          const title = 'title';
          const sourceNodeId = '1234';

          fn.mockReturnValue([
            {
              type: name,
              message,
              title,
              sourceNodeId,
            },
          ]);

          processNotifications({
            existingNotifications: [],
            extendedPullRequest: {},
          });

          expect(window.Notification).toHaveBeenCalledTimes(1);
          expect(window.Notification).toHaveBeenCalledWith(title, {
            body: message,
          });
        });
      });

      describe(`when the ${name} rule does not return a new notification`, () => {
        it('does not trigger a notification', () => {
          fn.mockReturnValue([]);

          processNotifications({
            existingNotifications: [],
            extendedPullRequest: {},
          });

          expect(window.Notification).not.toHaveBeenCalled();
        });
      });
    });
  });

  it('returns a combined array of existing and new notifications', () => {
    const message = 'someone requested your review';
    const title = 'Review Requested';

    const reviewRequestedNotification = {
      type: notificationTypes.REVIEW_REQUESTED,
      message,
      title,
    };
    reviewRequested.mockReturnValue([reviewRequestedNotification]);

    const anotherNotification = {
      type: 'randomNotification',
    };

    const combinedNotifications = processNotifications({
      existingNotifications: [anotherNotification],
      extendedPullRequest: {},
    });

    expect(combinedNotifications).toEqual([
      anotherNotification,
      reviewRequestedNotification,
    ]);
  });
});
