import processNotifications from './processNotifications';
import { notificationTypes, pullRequestStates } from '../constants';
import reviewRequested from './notificationRules/reviewRequested';
import reviewOnYourPR from './notificationRules/reviewOnYourPR';
import pullRequestStateChange from './notificationRules/pullRequestStateChange';
import newComments from './notificationRules/newComments';

jest.mock('./notificationRules/reviewRequested');
jest.mock('./notificationRules/reviewOnYourPR');
jest.mock('./notificationRules/pullRequestStateChange');
jest.mock('./notificationRules/newComments');

describe('processNotifications', () => {
  const notificationMock = jest.fn(() => ({}));

  beforeAll(() => {
    window.Notification = notificationMock;
  });

  beforeEach(() => {
    reviewRequested.mockReturnValue([]);
    reviewOnYourPR.mockReturnValue([]);
    pullRequestStateChange.mockReturnValue([]);
    newComments.mockReturnValue([]);
  });

  afterEach(() => {
    reviewRequested.mockReset();
    reviewOnYourPR.mockReset();
    pullRequestStateChange.mockReset();
    newComments.mockReset();
    notificationMock.mockClear();
  });

  const existingNotifications = [{ type: 'NOTIFICATION_TYPE' }];
  const extendedPullRequest = { id: '12345' };
  const currentUser = 'dev';
  const userSettings = {
    notifications: {},
  };

  const rules = [
    {
      name: 'reviewRequested',
      fn: reviewRequested,
      requiredArgs: {
        existingNotifications,
        pullRequest: extendedPullRequest,
        userSettings,
      },
    },
    {
      name: 'reviewOnYourPR',
      fn: reviewOnYourPR,
      requiredArgs: {
        existingNotifications,
        pullRequest: extendedPullRequest,
        currentUser,
        userSettings,
      },
    },
    {
      name: 'pullRequestStateChange',
      fn: pullRequestStateChange,
      requiredArgs: {
        existingNotifications,
        pullRequest: extendedPullRequest,
        currentUser,
        userSettings,
      },
    },
    {
      name: 'newComments',
      fn: newComments,
      requiredArgs: {
        existingNotifications,
        pullRequest: extendedPullRequest,
        currentUser,
        userSettings,
      },
    },
  ];

  describe('rule processing', () => {
    rules.forEach(({ name, fn, requiredArgs }) => {
      it('calls the rule with the required arguments', () => {
        processNotifications({
          existingNotifications,
          extendedPullRequest,
          currentUser,
          userSettings,
        });

        expect(fn).toHaveBeenCalledWith(requiredArgs);
      });

      describe(`when the ${name} rule returns a new notification`, () => {
        const message = 'message';
        const title = 'title';
        const sourceNodeId = '1234';
        describe('when trigger is set to true on the notification', () => {
          it('triggers the notification', () => {
            fn.mockReturnValue([
              {
                type: name,
                message,
                title,
                sourceNodeId,
                trigger: true,
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

        describe('when trigger is set to false on the notification', () => {
          it('does not trigger the notification', () => {
            fn.mockReturnValue([
              {
                type: name,
                message,
                title,
                sourceNodeId,
                trigger: false,
              },
            ]);

            processNotifications({
              existingNotifications: [],
              extendedPullRequest: {},
            });

            expect(window.Notification).not.toHaveBeenCalled();
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

  describe('when the PR has no existing notifications', () => {
    describe(`when the PR is in a ${pullRequestStates.CLOSED} state`, () => {
      let notifications;

      beforeEach(() => {
        notifications = processNotifications({
          existingNotifications: [],
          extendedPullRequest: {
            state: pullRequestStates.CLOSED,
          },
        });
      });

      it('does not process/trigger any notifications', () => {
        rules.forEach(({ fn }) => {
          expect(fn).not.toHaveBeenCalled();
        });
      });

      it('returns an empty array', () => {
        expect(notifications).toEqual([]);
      });
    });

    describe(`when the PR is in a ${pullRequestStates.MERGED} state`, () => {
      let notifications;

      beforeEach(() => {
        notifications = processNotifications({
          existingNotifications: [],
          extendedPullRequest: {
            state: pullRequestStates.MERGED,
          },
        });
      });

      it('does not process/trigger any notifications', () => {
        rules.forEach(({ fn }) => {
          expect(fn).not.toHaveBeenCalled();
        });
      });

      it('returns an empty array', () => {
        expect(notifications).toEqual([]);
      });
    });

    describe(`when the PR is in a ${pullRequestStates.OPEN} state`, () => {
      it('processes notifications', () => {
        processNotifications({
          existingNotifications: [],
          extendedPullRequest: {
            state: pullRequestStates.OPEN,
          },
        });

        rules.forEach(({ fn }) => {
          expect(fn).toHaveBeenCalled();
        });
      });
    });
  });
});
