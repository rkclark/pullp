import React from 'react';
import { shallow } from 'enzyme';
import AccountDetails from '.';

describe('AccountDetails', () => {
  const props = {
    login: 'test',
    avatarUrl: 'test.com',
    toggleLogoutModal: () => {},
  };

  it('renders successsfully', () => {
    const component = shallow(<AccountDetails {...props} />);
    expect(component).toHaveLength(1);
  });

  it('renders login name', () => {
    const component = shallow(<AccountDetails {...props} />);
    expect(component.text()).toContain(props.login);
  });

  it('renders avatar', () => {
    const component = shallow(<AccountDetails {...props} />);
    expect(component.find('img').props().src).toBe(props.avatarUrl);
  });

  describe('Logout button', () => {
    it('renders successfully', () => {
      const component = shallow(<AccountDetails {...props} />);
      expect(component.find('button').text()).toBe('Logout');
    });
    describe('when clicked', () => {
      it('dispatches toggleLogoutModal action', () => {
        const toggleLogoutModal = jest.fn();
        expect(toggleLogoutModal).not.toHaveBeenCalled();
        const component = shallow(
          <AccountDetails {...props} toggleLogoutModal={toggleLogoutModal} />,
        );
        const button = component.find('button');
        button.simulate('click');
        expect(toggleLogoutModal).toHaveBeenCalled();
      });
    });
  });
});
