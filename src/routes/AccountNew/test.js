import React from 'react';
import { shallow } from 'enzyme';
import { AccountContainer } from '.';
import AccountDetails from '../../components/AccountDetails';

describe('Account', () => {
  const defaultProps = {
    login: 'test',
    avatarUrl: 'test.com',
    toggleLogoutModalAction: () => {},
    logoutAction: () => {},
    toggleLogoutModal: () => {},
    logoutModalOpen: false,
  };

  it('renders successsfully', () => {
    const component = shallow(<AccountContainer {...defaultProps} />);
    expect(component).toHaveLength(1);
  });

  describe('when login is set', () => {
    it('renders AccountDetails', () => {
      const component = shallow(<AccountContainer {...defaultProps} />);
      expect(component.find(AccountDetails).length).toBe(1);
    });
  });

  describe('when login is not set', () => {
    it('does not render AccountDetails', () => {
      const component = shallow(
        <AccountContainer {...defaultProps} login={null} />,
      );
      expect(component.find(AccountDetails).length).toBe(0);
    });
  });
});
