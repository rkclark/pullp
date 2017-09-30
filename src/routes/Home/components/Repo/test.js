import React from 'react';
import { shallow } from 'enzyme';
import Repo from './';

describe('Repo', () => {
  const props = {
    data: {
      id: 'testId',
      name: 'testRepo',
      pullRequests: [
        {
          createdAt: '2017-09-26T20:23:44Z',
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
        },
        {
          createdAt: '2017-09-25T20:23:44Z',
          closed: false,
          mergedAt: null,
          url: 'prUrl',
          number: 99,
          title: 'a nice pr 2',
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
        },
      ],
    },
  };

  it('renders successfully', () => {
    const component = shallow(<Repo {...props} />);
    expect(component).toHaveLength(1);
  });

  it('renders number of PRs', () => {
    const component = shallow(<Repo {...props} />);
    expect(component.text()).toContain('2');
  });
});
