import React from 'react';
import { shallow } from 'enzyme';
import AccountDetails from '.';
import LogoutModal from '../LogoutModal';
import Button from '../../../../components/Button';

describe('AccountDetails', () => {
  const props = {
    login: 'test',
    avatarUrl: 'test.com',
    toggleLogoutModal: () => {},
    logoutModalOpen: true,
    logoutAction: () => {},
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

  it('renders logout modal', () => {
    const component = shallow(<AccountDetails {...props} />);
    expect(component.find(LogoutModal).length).toBe(1);
  });

  describe('Logout button', () => {
    it('renders successfully', () => {
      const component = shallow(<AccountDetails {...props} />);
      expect(component.find(Button).props().children).toBe('Sign out');
    });
    describe('when clicked', () => {
      it('dispatches toggleLogoutModal action', () => {
        const toggleLogoutModal = jest.fn();
        const component = shallow(
          <AccountDetails {...props} toggleLogoutModal={toggleLogoutModal} />,
        );
        expect(toggleLogoutModal).not.toHaveBeenCalled();
        const button = component.find(Button);
        button.simulate('click');
        expect(toggleLogoutModal).toHaveBeenCalled();
      });
    });
  });
});
