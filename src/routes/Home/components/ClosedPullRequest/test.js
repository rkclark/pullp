import React from 'react';
import { shallow } from 'enzyme';
import ClosedPullRequest from './';

describe('ClosedPullRequest', () => {
  const props = {
    id: '123',
    url: 'prUrl',
    number: 94,
    title: 'a nice pr',
    state: 'CLOSED',
    author: {
      avatarUrl: 'avatarurl',
      login: 'name',
    },
    pullpPullRequest: {
      notifications: [],
    },
  };

  it('renders successfully', () => {
    const component = shallow(<ClosedPullRequest {...props} />);
    expect(component).toHaveLength(1);
  });
});
