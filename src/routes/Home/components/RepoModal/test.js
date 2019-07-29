import React from 'react';
import { shallow } from 'enzyme';
import RepoModal from './';
import PullRequest from '../PullRequest';

describe('RepoModal', () => {
  const props = {
    toggleOpenRepo: () => {},
    data: {
      id: 'testId',
      name: 'testRepo',
      owner: {
        login: 'test',
        avatarUrl: 'test.com',
      },
      pullRequests: [
        {
          id: '123',
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
          },
        },
        {
          id: '456',
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
          },
        },
      ],
      closedPullRequests: [
        {
          id: '123',
          url: 'prUrl',
          number: 94,
          title: 'a nice pr',
          state: 'CLOSED',
          author: {
            avatarUrl: 'avatarurl',
            login: 'name',
          },
        },
      ],
    },
  };

  it('renders successfully', () => {
    const component = shallow(<RepoModal {...props} />);
    expect(component).toHaveLength(1);
  });

  it('renders PRs', () => {
    const component = shallow(<RepoModal {...props} />);
    expect(component.find(PullRequest).length).toBe(2);
  });

  describe('when close button clicked', () => {
    it('dispatches toggleOpenRepo with null', () => {
      const toggleOpenRepo = jest.fn();
      const component = shallow(
        <RepoModal {...props} toggleOpenRepo={toggleOpenRepo} />,
      );
      component.find('[data-test-id="closeButton"]').simulate('click');
      expect(toggleOpenRepo).toHaveBeenCalledWith(null);
    });
  });

  describe('when esc key is pressed', () => {
    it('dispatches toggleOpenRepo with null', () => {
      const toggleOpenRepo = jest.fn();
      const component = shallow(
        <RepoModal {...props} toggleOpenRepo={toggleOpenRepo} />,
      );

      component.instance().onKeyDown({
        keyCode: 27,
      });

      expect(toggleOpenRepo).toHaveBeenCalledWith(null);
    });
  });
});
