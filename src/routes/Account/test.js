import React from 'react';
import { shallow } from 'enzyme';
import { Account } from '.';
import AccountDetails from '../../components/AccountDetails';
import LoadingMessage from '../../components/LoadingMessage';
import Error from '../../components/Error';

describe('Account', () => {
  const defaultProps = {
    data: {
      viewer: {
        login: 'test',
        avatarUrl: 'url',
      },
    },
    error: null,
    loading: false,
  };

  let component;

  beforeAll(() => {
    component = shallow(<Account {...defaultProps} />);
  });

  it('renders successsfully', () => {
    expect(component).toHaveLength(1);
  });

  describe('when loading', () => {
    it('renders a LoadingMessage', () => {
      const originalComponent = component;
      component = shallow(<Account {...defaultProps} loading />);
      expect(component.find(LoadingMessage).length).toBe(1);
      component = originalComponent;
    });
  });

  describe('when not loading', () => {
    it('does not render a LoadingMessage', () => {
      expect(component.find(LoadingMessage).length).toBe(0);
    });
  });

  describe('when there is an error', () => {
    it('renders an Error', () => {
      const originalComponent = component;
      component = shallow(
        <Account {...defaultProps} error={{ message: 'borked' }} />,
      );
      expect(component.find(Error).length).toBe(1);
      component = originalComponent;
    });
  });

  describe('when there is not an error', () => {
    it('does not render an Error', () => {
      expect(component.find(Error).length).toBe(0);
    });
  });

  it('renders AccountDetails with correct props', () => {
    expect(component.find(AccountDetails).length).toBe(1);
  });

  describe('logout function', () => {
    let clearStorageMock;
    let clearLocalStorageMock;
    const originalWindowLocation = window.location;

    beforeAll(async () => {
      // console.error = () => {};
      clearStorageMock = jest.fn();
      window.electron = {
        remote: {
          session: {
            defaultSession: {
              clearStorageData: clearStorageMock,
            },
          },
        },
      };

      clearLocalStorageMock = jest.fn();

      window.localStorage = {
        clear: clearLocalStorageMock,
      };

      // Have to delete and re-create window.location to avoid errors
      delete window.location;
      window.location = { pathname: 'test' };

      const logoutFn = component.find(AccountDetails).props().logout;
      await logoutFn();
    });

    afterAll(() => {
      window.location = originalWindowLocation;
    });

    it('clears cookies', async () => {
      expect(clearStorageMock).toHaveBeenCalledWith({ storages: 'cookies' });
    });

    it('clears localStorage', async () => {
      expect(clearLocalStorageMock).toHaveBeenCalled();
    });

    it('redirects user to homepage', async () => {
      expect(window.location.pathname).toBe('/app');
    });
  });
});
