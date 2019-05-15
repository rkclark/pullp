import React from 'react';
import { shallow, mount } from 'enzyme';
import { MockedProvider } from 'react-apollo/test-utils';
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
    const component = mount(
      <MockedProvider>
        <NotificationSettings {...props} />
      </MockedProvider>,
    );

    Object.entries(props.notifications).forEach(({ 0: key }) => {
      it(`renders a "trigger" checkbox for ${key}`, () => {
        const checkbox = component
          .find(CheckBox)
          .filterWhere(node => node.props().name === `${key}_TRIGGER`);
        expect(checkbox.length).toBe(1);
      });

      it(`renders a "showOnTimeline" checkbox for ${key}`, () => {
        const checkbox = component
          .find(CheckBox)
          .filterWhere(node => node.props().name === `${key}_SHOW_ON_TIMELINE`);
        expect(checkbox.length).toBe(1);
      });
    });

    describe('when notifications contains a key that does not have an associated name', () => {
      it('does not render checkboxes for it', () => {
        const unknownKey = 'test';
        const componentWithUnknownNotification = mount(
          <MockedProvider>
            <NotificationSettings
              {...props}
              notifications={{
                ...props.notifications,
                [unknownKey]: 'a value',
              }}
            />,
          </MockedProvider>,
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
