import React from 'react';
import { shallow } from 'enzyme';
import NotificationSettings from '.';
import CheckBox from '../CheckBox';

describe('NotificationSettings', () => {
  const props = {
    notifications: {
      REVIEW_REQUESTED: {
        trigger: true,
        showOnTimeline: true,
        __typename: 'NotificationSetting',
      },
      REVIEW_ON_YOUR_PR: {
        trigger: true,
        showOnTimeline: true,
        __typename: 'NotificationSetting',
      },
      PR_STATE_CHANGE: {
        trigger: true,
        showOnTimeline: true,
        __typename: 'NotificationSetting',
      },
      NEW_COMMENTS: {
        trigger: false,
        showOnTimeline: true,
        __typename: 'NotificationSetting',
      },
      NEW_COMMENTS_ON_YOUR_PR: {
        trigger: true,
        showOnTimeline: true,
        __typename: 'NotificationSetting',
      },
    },
  };

  it('renders successsfully', () => {
    const component = shallow(<NotificationSettings {...props} />);
    expect(component).toHaveLength(1);
  });

  describe('checkboxes', () => {
    const component = shallow(<NotificationSettings {...props} />);

    Object.entries(props.notifications).forEach(({ 0: key }) => {
      it(`renders a "trigger" checkbox for ${key}`, () => {
        const checkbox = component.find({ name: `${key}_TRIGGER` });
        expect(checkbox.length).toBe(1);
        expect(checkbox.type()).toBe(CheckBox);
      });

      it(`renders a "showOnTimeline" checkbox for ${key}`, () => {
        const checkbox = component.find({ name: `${key}_SHOW_ON_TIMELINE` });
        expect(checkbox.length).toBe(1);
        expect(checkbox.type()).toBe(CheckBox);
      });
    });

    describe('when notifications contains a key that does not have an associated name', () => {
      it('does not render checkboxes for it', () => {
        const unknownKey = 'test';
        const componentWithUnknownNotification = shallow(
          <NotificationSettings
            {...props}
            notifications={{
              ...props.notifications,
              [unknownKey]: 'a value',
            }}
          />,
        );

        expect(
          componentWithUnknownNotification.find({
            name: `${unknownKey}_TRIGGER`,
          }).length,
        ).toBe(0);

        expect(
          componentWithUnknownNotification.find({
            name: `${unknownKey}_SHOW_ON_TIMELINE`,
          }).length,
        ).toBe(0);
      });
    });
  });
});
