import React from 'react';
import { shallow } from 'enzyme';
import PullRequest from './';

describe('PullRequest', () => {
  const props = {
    id: '123',
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
    comments: {
      totalCount: 0,
    },
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
