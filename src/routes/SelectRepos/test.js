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
    changeReposPage: () => {},
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
  describe('pagination', () => {
    it('renders the current page number and total pages', () => {
      const component = shallow(<SelectRepos {...props} />);
      const currentPage = component.find('[data-test-id="currentPage"]');
      expect(currentPage.text()).toEqual('1 of 3');
    });
    describe('next page', () => {
      describe('when there is a next page', () => {
        it('renders a next page button', () => {
          const component = shallow(<SelectRepos {...props} />);
          const nextButton = component.find('[data-test-id="nextButton"]');
          expect(nextButton.length).toBe(1);
        });
        it('calls changePage action on click', () => {
          const changeReposPage = jest.fn();
          const component = shallow(
            <SelectRepos {...props} changeReposPage={changeReposPage} />,
          );
          component.find('[data-test-id="nextButton"]').simulate('click');
          expect(changeReposPage).toHaveBeenCalledWith(2);
        });
      });
      describe('when there is not a next page', () => {
        it('does not render a next page button', () => {
          const component = shallow(
            <SelectRepos
              {...props}
              paginatedRepos={{ ...props.paginatedRepos, hasNextPage: false }}
            />,
          );
          const nextButton = component.find('[data-test-id="nextButton"]');
          expect(nextButton.length).toBe(0);
        });
      });
    });
    describe('previous page', () => {
      const baseProps = {
        ...props,
        paginatedRepos: {
          ...props.paginatedRepos,
          hasPreviousPage: true,
          currentPage: 2,
        },
      };
      describe('when there is a previous page', () => {
        it('renders a previous page button', () => {
          const component = shallow(<SelectRepos {...baseProps} />);
          const previousButton = component.find(
            '[data-test-id="previousButton"]',
          );
          expect(previousButton.length).toBe(1);
        });
        it('calls changePage action on click', () => {
          const changeReposPage = jest.fn();
          const component = shallow(
            <SelectRepos {...baseProps} changeReposPage={changeReposPage} />,
          );
          component.find('[data-test-id="previousButton"]').simulate('click');
          expect(changeReposPage).toHaveBeenCalledWith(1);
        });
      });
      describe('when there is not a previous page', () => {
        it('does not render a previous page button', () => {
          const component = shallow(
            <SelectRepos
              {...baseProps}
              paginatedRepos={{
                ...baseProps.paginatedRepos,
                hasPreviousPage: false,
              }}
            />,
          );
          const previousButton = component.find(
            '[data-test-id="previousButton"]',
          );
          expect(previousButton.length).toBe(0);
        });
      });
    });
    describe('when there are no results', () => {
      const baseProps = {
        ...props,
        paginatedRepos: {
          ...props.paginatedRepos,
          hasPreviousPage: false,
          currentPage: null,
          pages: {},
        },
      };
      it('does not render current or total pages', () => {
        const component = shallow(<SelectRepos {...baseProps} />);
        const currentPage = component.find('[data-test-id="currentPage"]');
        expect(currentPage.length).toBe(0);
      });
    });
  });
});
