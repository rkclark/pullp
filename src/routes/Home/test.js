import React from 'react';
import { shallow, mount } from 'enzyme';
import { Home } from '.';
import Repo from './components/Repo';

describe('Home', () => {
  const baseProps = {
    redirectPath: '/',
    saveRedirect: () => {},
    currentUser: {
      login: 'person',
      avatarUrl: 'avatar.com',
      url: 'url.com',
    },
    githubToken: 'token',
    requestPullRequests: () => {},
    selectedRepos: ['1', '2', '3'],
    repositories: [
      { id: '1', pullRequests: [] },
      { id: '2', pullRequests: [] },
      { id: '3', pullRequests: [] },
    ],
    toggleOpenRepo: () => {},
  };

  it('renders successfully', () => {
    const component = shallow(<Home {...baseProps} />);
    expect(component.length).toBe(1);
  });

  it('renders a repo for each repo in props', () => {
    const component = shallow(<Home {...baseProps} />);
    expect(component.find(Repo).length).toBe(3);
  });

  describe('when there is a currentUser', () => {
    it('dispatches requestPullRequests action', () => {
      const requestPullRequests = jest.fn();
      mount(<Home {...baseProps} requestPullRequests={requestPullRequests} />);
      expect(requestPullRequests).toHaveBeenCalledWith(
        baseProps.githubToken,
        baseProps.selectedRepos,
      );
    });
    xit('sets an interval on window to run requestPullRequests', () => {
      global.setInterval = jest.fn();
      mount(<Home {...baseProps} />);
      const requestPullRequestsFn = `() => {
        this.props.requestPullRequests(
        this.props.githubToken,
        this.props.selectedRepos);

      }`;
      expect(global.setInterval.mock.calls[0][0].toString()).toEqual(
        requestPullRequestsFn,
      );
      expect(global.setInterval.mock.calls[0][1]).toEqual(60000);
    });
  });

  describe('when unmounts', () => {
    it('clears interval on window', () => {
      global.clearInterval = jest.fn();
      const component = mount(<Home {...baseProps} />);
      component.unmount();
      expect(global.clearInterval).toHaveBeenCalled;
    });
  });
});
