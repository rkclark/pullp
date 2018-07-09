import React from 'react';
import { shallow, mount } from 'enzyme';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';
import { Home } from '.';
import Repo from './components/Repo';
import { MAXIMUM_PRS } from '../../constants';
import reposWithPullRequestsQuery from '../../queries/reposWithPullRequests.graphql';

const repositories = [
  {
    id: '1',
    pullRequests: [],
    name: 'testRepo',
    owner: {
      login: 'test',
      avatarUrl: 'test.com',
    },
    url: 'test.com',
  },
  {
    id: '2',
    pullRequests: [],
    name: 'testRepo',
    owner: {
      login: 'test',
      avatarUrl: 'test.com',
    },
    url: 'test.com',
  },
  {
    id: '3',
    pullRequests: [],
    name: 'testRepo',
    owner: {
      login: 'test',
      avatarUrl: 'test.com',
    },
    url: 'test.com',
  },
];

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
    toggleOpenRepo: () => {},
  };

  it('renders successfully', () => {
    const component = shallow(<Home {...baseProps} />);
    expect(component.length).toBe(1);
  });

  it.only('renders a repo for each repo in props', async () => {
    const component = mount(
      <MockedProvider
        mocks={[
          {
            result: { data: repositories },
            request: {
              query: reposWithPullRequestsQuery,
              variables: {
                ids: baseProps.selectedRepos,
                maximumPrs: MAXIMUM_PRS,
              },
            },
          },
        ]}
      >
        <Home {...baseProps} />
      </MockedProvider>,
    );
    // console.log(reposWithPullRequestsQuery);
    await wait(0);
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
      global.cancelAnimationFrame = () => {};
      const component = mount(<Home {...baseProps} />);
      component.unmount();
      expect(global.clearInterval).toHaveBeenCalled;
    });
  });
});
