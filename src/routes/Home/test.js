import React from 'react';
import { shallow, mount } from 'enzyme';
import { Home } from '.';
import CurrentUser from './components/CurrentUser';

describe('Home', () => {
  const baseProps = {
    redirectPath: '/',
    saveRedirect: () => {},
    currentUser: {
      login: 'person',
      avatarUrl: 'avatar.com',
      url: 'url.com',
    },
    requestCurrentUser: () => {},
    githubToken: 'token',
    requestPullRequests: () => {},
    selectedRepos: ['1', '2', '3'],
  };

  it('renders successfully', () => {
    const component = shallow(<Home {...baseProps} />);
    expect(component.length).toBe(1);
  });

  describe('when there is a currentUser', () => {
    it('renders a CurrentUser', () => {
      const component = shallow(<Home {...baseProps} />);
      expect(component.find(CurrentUser).length).toBe(1);
    });

    it('dispatches requestPullRequests action', () => {
      const requestPullRequests = jest.fn();
      mount(<Home {...baseProps} requestPullRequests={requestPullRequests} />);
      expect(requestPullRequests).toHaveBeenCalledWith(
        baseProps.githubToken,
        baseProps.selectedRepos,
      );
    });
  });
  describe('when there is no currentUser and a githubToken', () => {
    it('dispatches requestCurrentUser action', () => {
      const requestCurrentUser = jest.fn();
      mount(
        <Home
          {...baseProps}
          requestCurrentUser={requestCurrentUser}
          currentUser={null}
        />,
      );
      expect(requestCurrentUser).toHaveBeenCalledWith(baseProps.githubToken);
    });
  });

  describe('when redirectPath === "/"', () => {
    it('dispatches saveDirect action with null arg', () => {
      const saveRedirect = jest.fn();
      mount(<Home {...baseProps} saveRedirect={saveRedirect} />);
      expect(saveRedirect).toHaveBeenCalledWith(null);
    });
  });
});
