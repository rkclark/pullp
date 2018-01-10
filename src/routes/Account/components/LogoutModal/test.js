import React from 'react';
import { shallow } from 'enzyme';
import LogoutModal from '.';

describe('LogoutModal', () => {
  const props = {
    logoutModalOpen: true,
    logoutAction: () => {},
    toggleLogoutModal: () => {},
  };

  it('renders successsfully', () => {
    const component = shallow(<LogoutModal {...props} />);
    expect(component).toHaveLength(1);
  });

  describe('when closed', () => {
    it('returns null', () => {
      const component = shallow(
        <LogoutModal {...props} logoutModalOpen={false} />,
      );
      expect(component.html()).toBe(null);
    });
  });

  describe('when open', () => {
    it('renders yes button', () => {
      const component = shallow(<LogoutModal {...props} />);
      expect(component.find('.yesButton').length).toBe(1);
    });

    it('renders no button', () => {
      const component = shallow(<LogoutModal {...props} />);
      expect(component.find('.noButton').length).toBe(1);
    });

    it('renders modal overlay', () => {
      const component = shallow(<LogoutModal {...props} />);
      expect(component.find('.modalOverlay').length).toBe(1);
    });
  });

  describe('yes button', () => {
    it('calls logout action', () => {
      const logoutAction = jest.fn();
      const component = shallow(
        <LogoutModal {...props} logoutAction={logoutAction} />,
      );
      expect(logoutAction).not.toHaveBeenCalled();
      const button = component.find('.yesButton');
      button.simulate('click');
      expect(logoutAction).toHaveBeenCalled();
    });
  });

  describe('no button', () => {
    it('calls toggleLogoutModal action', () => {
      const toggleLogoutModal = jest.fn();
      const component = shallow(
        <LogoutModal {...props} toggleLogoutModal={toggleLogoutModal} />,
      );
      expect(toggleLogoutModal).not.toHaveBeenCalled();
      const button = component.find('.noButton');
      button.simulate('click');
      expect(toggleLogoutModal).toHaveBeenCalled();
    });
  });

  describe('modal overlay', () => {
    it('calls toggleLogoutModal action on click', () => {
      const toggleLogoutModal = jest.fn();
      const component = shallow(
        <LogoutModal {...props} toggleLogoutModal={toggleLogoutModal} />,
      );
      expect(toggleLogoutModal).not.toHaveBeenCalled();
      const button = component.find('.modalOverlay');
      button.simulate('click');
      expect(toggleLogoutModal).toHaveBeenCalled();
    });
  });
});
