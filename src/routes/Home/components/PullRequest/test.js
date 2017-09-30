import React from 'react';
import { shallow } from 'enzyme';
import PullRequest from './';

describe('PullRequest', () => {
  const props = {
    date: '01/01/2017',
    time: '18:00:00',
    closed: false,
    mergedAt: null,
    url: 'prUrl',
    number: 94,
    title: 'a nice pr',
    assignees: [],
    author: {
      avatarUrl: 'avatarurl',
      login: 'name',
      url: 'url',
    },
    participants: [
      {
        avatarUrl: 'avatarurl',
        login: 'name',
        url: 'url',
      },
      {
        avatarUrl: 'avatarurl2',
        login: 'name2',
        url: 'url2',
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
  };

  it('renders successfully', () => {
    const component = shallow(<PullRequest {...props} />);
    expect(component).toHaveLength(1);
  });
});
