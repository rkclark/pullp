import React from 'react';
import { shallow, mount } from 'enzyme';
import { SelectRepos } from './';
import RepoCheckbox from './components/RepoCheckbox';

describe('SelectRepos', () => {
  const props = {
    githubError: null,
    requestWatchedRepos: jest.fn(),
    toggleRepoSelection: () => {},
    performFiltering: () => {},
    paginatedRepos: {
      currentPage: 1,
      hasNextPage: true,
      hasPreviousPage: false,
      totalPages: 3,
      pages: {
        1: [
          {
            name: 'test1',
            id: 'MDEwOlJlcG9zaXRvcnk3MDk0NTE5Ng==',
            url: 'url',
          },
          {
            name: 'test2',
            id: 'MDEwOlJlcG9zaXRvcnk3Mjc1NzkxNg==',
            url: 'url',
          },
        ],
        2: [
          {
            name: 'test3',
            id: 'testid1==',
            url: 'url',
          },
          {
            name: 'test4',
            id: 'testid2==',
            url: 'url',
          },
        ],
        3: [
          {
            name: 'test5',
            id: 'MDEwOlJlcG9zaXRvcnk3MDk0NTE5Ng==',
            url: 'url',
          },
          {
            name: 'test6',
            id: 'MDEwOlJlcG9zaXRvcnk3Mjc1NzkxNg==',
            url: 'url',
          },
        ],
      },
    },
    selectedRepos: [],
    repoFilterValue: null,
  };

  it('renders successfully', () => {
    const component = shallow(<SelectRepos {...props} />);
    expect(component).toHaveLength(1);
  });

  it('renders a RepoCheckbox for each repo on current page', () => {
    const component = shallow(<SelectRepos {...props} />);
    expect(component.find(RepoCheckbox)).toHaveLength(2);
    expect(
      component
        .find(RepoCheckbox)
        .at(0)
        .props().name,
    ).toEqual('test1');
    expect(
      component
        .find(RepoCheckbox)
        .at(1)
        .props().name,
    ).toEqual('test2');
  });

  it('calls requestWatchedRepos when mounted', () => {
    const component = mount(<SelectRepos {...props} />);
    expect(component.requestWatchedRepos).toHaveBeenCalled;
  });

  describe('filtering', () => {
    describe('filter input field', () => {
      it('calls performFiltering on change', () => {
        const testValue = 'omg';
        const performFiltering = jest.fn();
        const component = shallow(
          <SelectRepos {...props} performFiltering={performFiltering} />,
        );
        component
          .find('[data-test-id="filterInput"]')
          .simulate('change', { target: { value: testValue } });
        expect(performFiltering).toHaveBeenCalledWith(testValue);
      });
      it('has value === repoFilterValue', () => {
        const testValue = 'omg';
        const component = shallow(
          <SelectRepos {...props} repoFilterValue={testValue} />,
        );
        const field = component.find('[data-test-id="filterInput"]');
        expect(field.props().value).toEqual(testValue);
      });
      describe('when repoFilterValue is null', () => {
        it("has value === ''", () => {
          const component = shallow(<SelectRepos {...props} />);
          const field = component.find('[data-test-id="filterInput"]');
          expect(field.props().value).toEqual('');
        });
      });
    });
  });
});
