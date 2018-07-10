import React from 'react';
import { shallow, mount } from 'enzyme';
import { MockedProvider } from 'react-apollo/test-utils';
import { Query } from 'react-apollo';
import wait from 'waait';
import { Home } from '.';
import Repo from './components/Repo';
import { MAXIMUM_PRS } from '../../constants';
import reposWithPullRequestsQuery from '../../queries/reposWithPullRequests.graphql';

const repositories = {
  nodes: [
    {
      id: '1',
      pullRequests: {
        totalCount: 4,
        edges: [
          {
            node: {
              createdAt: '2016-10-15T10:39:37Z',
              closed: true,
              mergedAt: '2016-10-15T10:39:44Z',
              url: 'https://github.com/jh2633/Atticus_Legal/pull/1',
              number: 1,
              title: 'Design2',
              author: {
                avatarUrl:
                  'https://avatars0.githubusercontent.com/u/18387550?v=4',
                login: 'jh2633',
                url: 'https://github.com/jh2633',
              },
              reviewRequests: {
                edges: [
                  {
                    node: {
                      requestedReviewer: {
                        login: 'testUser',
                      },
                    },
                  },
                ],
              },
              reviews: {
                edges: [
                  {
                    node: {
                      author: {
                        login: 'testUser',
                        avatarUrl: 'url',
                      },
                      createdAt: '2017-10-05T10:07:18Z',
                      state: 'COMMENTED',
                    },
                  },
                  {
                    node: {
                      author: {
                        login: 'person',
                        avatarUrl: 'url',
                      },
                      createdAt: '2017-10-05T10:07:18Z',
                      state: 'COMMENTED',
                    },
                  },
                  {
                    node: {
                      author: {
                        login: 'person',
                        avatarUrl: 'url',
                      },
                      createdAt: '2017-10-05T10:07:18Z',
                      state: 'APPROVED',
                    },
                  },
                  {
                    node: {
                      author: {
                        login: 'person',
                        avatarUrl: 'url',
                      },
                      createdAt: '2017-10-05T10:07:18Z',
                      state: 'APPROVED',
                    },
                  },
                ],
              },
            },
          },
          {
            node: {
              createdAt: '2016-10-15T10:39:37Z',
              closed: false,
              mergedAt: null,
              url: 'https://github.com/jh2633/Atticus_Legal/pull/2',
              number: 2,
              title:
                'footer changed on all pages, new forms pages added but in dev, index …',
              author: {
                avatarUrl:
                  'https://avatars0.githubusercontent.com/u/18387550?v=4',
                login: 'jh2633',
                url: 'https://github.com/jh2633',
              },
              reviewRequests: {
                edges: [
                  {
                    node: {
                      requestedReviewer: {
                        login: 'wrongUser',
                      },
                    },
                  },
                  {
                    node: {
                      requestedReviewer: {
                        team: 'wrongTeam',
                        id: '2',
                      },
                    },
                  },
                ],
              },
              reviews: {
                edges: [
                  {
                    node: {
                      author: {
                        login: 'person',
                        avatarUrl: 'url',
                      },
                      createdAt: '2017-10-05T10:07:18Z',
                      state: 'COMMENTED',
                    },
                  },
                ],
              },
            },
          },
          {
            node: {
              createdAt: '2016-10-15T10:39:37Z',
              closed: false,
              mergedAt: null,
              url: 'https://github.com/jh2633/Atticus_Legal/pull/2',
              number: 3,
              title:
                'footer changed on all pages, new forms pages added but in dev, index …',
              author: {
                avatarUrl:
                  'https://avatars0.githubusercontent.com/u/18387550?v=4',
                login: 'jh2633',
                url: 'https://github.com/jh2633',
              },
              reviewRequests: {
                edges: [
                  {
                    node: {
                      requestedReviewer: {
                        team: 'testTeam',
                        id: '1',
                      },
                    },
                  },
                ],
              },
              reviews: {
                edges: [],
              },
            },
          },
          {
            node: {
              createdAt: '2016-10-15T10:39:37Z',
              closed: false,
              mergedAt: null,
              url: 'https://github.com/jh2633/Atticus_Legal/pull/2',
              number: 4,
              title:
                'footer changed on all pages, new forms pages added but in dev, index …',
              author: {
                avatarUrl:
                  'https://avatars0.githubusercontent.com/u/18387550?v=4',
                login: 'testUser',
                url: 'https://github.com/jh2633',
              },
              reviewRequests: {
                edges: [
                  {
                    node: {
                      requestedReviewer: {
                        team: 'testTeam',
                        id: '1',
                      },
                    },
                  },
                  {
                    node: {
                      requestedReviewer: {
                        login: 'testUser',
                      },
                    },
                  },
                ],
              },
              reviews: {
                edges: [],
              },
            },
          },
        ],
      },
    },
    {
      id: '2',
      pullRequests: {
        totalCount: 0,
        edges: [],
      },
    },
    {
      id: '3',
      pullRequests: {
        totalCount: 0,
        edges: [],
      },
    },
  ],
};

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
    watchedRepos: [
      { id: 1, name: '1' },
      { id: 2, name: '2' },
      { id: 3, name: '3' },
    ],
    toggleOpenRepo: () => {},
  };

  it('renders successfully', () => {
    const component = shallow(<Home {...baseProps} />);
    expect(component.length).toBe(1);
  });

  it.only('renders a repo for each repo returned from query', async () => {
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
    // await wait(0);
    expect(component.text()).toContain('Loading');
    await wait(0);
    console.log(component.find(Query).props().variables);
    console.log(component.debug());
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
