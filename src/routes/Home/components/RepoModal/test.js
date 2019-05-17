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
          comments: [
            {
              author: {
                login: 'jh2633',
                avatarUrl:
                  'https://avatars0.githubusercontent.com/u/18387550?v=4',
                url: 'https://github.com/jh2633',
              },
              body: 'test',
              createdAt: '2017-10-10T14:32:24Z',
            },
            {
              author: {
                login: 'jh2633',
                avatarUrl:
                  'https://avatars0.githubusercontent.com/u/18387550?v=4',
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
          },
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
          comments: [
            {
              author: {
                login: 'jh2633',
                avatarUrl:
                  'https://avatars0.githubusercontent.com/u/18387550?v=4',
                url: 'https://github.com/jh2633',
              },
              body: 'test',
              createdAt: '2017-10-10T14:32:24Z',
            },
            {
              author: {
                login: 'jh2633',
                avatarUrl:
                  'https://avatars0.githubusercontent.com/u/18387550?v=4',
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
