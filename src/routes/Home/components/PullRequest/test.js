import React from 'react';
import { shallow } from 'enzyme';
import PullRequest from './';

describe('PullRequest', () => {
  const props = {
    closed: false,
    mergedAt: null,
    url: 'prUrl',
    number: 94,
    title: 'a nice pr',
    author: {
      avatarUrl: 'avatarurl',
      login: 'name',
      url: 'url',
    },
    comments: [
      {
        author: {
          login: 'jh2633',
          avatarUrl: 'https://avatars0.githubusercontent.com/u/18387550?v=4',
          url: 'https://github.com/jh2633',
        },
        body: 'test',
        createdAt: '2017-10-10T14:32:24Z',
      },
      {
        author: {
          login: 'jh2633',
          avatarUrl: 'https://avatars0.githubusercontent.com/u/18387550?v=4',
          url: 'https://github.com/jh2633',
        },
        body: 'test2',
        createdAt: '2017-10-10T14:32:24Z',
      },
    ],
    reviewRequests: [],
    reviews: [
      {
        author: {
          login: 'reviewer1',
          avatarUrl: 'url',
        },
        createdAt: '2017-09-27T09:03:57Z',
        state: 'APPROVED',
      },
    ],
    pullpPullRequest: {
      currentUserReviewRequested: false,
      reviewedByCurrentUser: true,
      date: '01/01/2017',
      time: '18:00:00',
      reviewsByAuthor: [],
    },
  };

  it('renders successfully', () => {
    const component = shallow(<PullRequest {...props} />);
    expect(component).toHaveLength(1);
  });
});
