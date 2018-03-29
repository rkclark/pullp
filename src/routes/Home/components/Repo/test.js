import React from 'react';
import { shallow } from 'enzyme';
import Repo from './';
import { MAXIMUM_PRS } from '../../../../constants';

describe('Repo', () => {
  const props = {
    toggleOpenRepo: () => {},
    data: {
      id: 'testId',
      name: 'testRepo',
      owner: {
        login: 'test',
        avatarUrl: 'test.com',
      },
      url: 'test.com',
      totalPullRequests: 2,
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

  describe('when clicked', () => {
    it('dispatches toggleOpenRepo with repo id', () => {
      const toggleOpenRepo = jest.fn();
      const component = shallow(
        <Repo {...props} toggleOpenRepo={toggleOpenRepo} />,
      );
      component.find('.indicatorsContainer').simulate('click');
      expect(toggleOpenRepo).toHaveBeenCalledWith(props.data.id);
    });
  });

  describe('when total PRs is more than maximum PRs', () => {
    it('shows max PR warning', () => {
      const totalPrs = MAXIMUM_PRS + 1;
      const testProps = {
        ...props,
        data: { ...props.data, totalPullRequests: totalPrs },
      };
      const component = shallow(<Repo {...testProps} />);
      expect(component.find('[data-test-id="maxPrWarning"]').length).toBe(1);
    });
  });

  describe('when total PRs is not more than maximum PRs', () => {
    it('does not show max PR warning', () => {
      const component = shallow(<Repo {...props} />);
      expect(component.find('[data-test-id="maxPrWarning"]').length).toBe(0);
    });
  });
});
