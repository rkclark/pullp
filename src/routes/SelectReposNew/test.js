import React from 'react';
import { shallow, mount } from 'enzyme';
import Pagination from 'react-js-pagination';
import { MockedProvider } from 'react-apollo/test-utils';
import { cloneDeep } from 'lodash';

import { SelectReposNew } from './';
import watchedRepos from './watchedReposFixture';
import RepoCheckbox from '../../components/RepoCheckbox';
import { WATCHED_REPOS_PAGINATION_RANGE } from '../../constants';
import LoadingMessage from '../../components/LoadingMessage';

const reposPerPage = 2;

describe('<SelectReposNew />', () => {
  const props = {
    data: watchedRepos,
    loading: false,
    reposPerPage,
  };

  it('renders succesfully', () => {
    const component = shallow(<SelectReposNew {...props} />);
    expect(component.length).toBe(1);
  });

  describe('when loading', () => {
    it('renders a <LoadingMessage/>', () => {
      const component = shallow(<SelectReposNew {...props} loading />);
      expect(component.find(LoadingMessage).length).toBe(1);
    });
  });

  describe('when not loading', () => {
    it('does not render a <LoadingMessage/>', () => {
      const component = shallow(<SelectReposNew {...props} loading={false} />);
      expect(component.find(LoadingMessage).length).toBe(0);
    });
  });

  describe('when watched repos data contains 5 repos & repos per page is 2', () => {
    describe('repo pages rendering', () => {
      let component;
      beforeAll(() => {
        component = mount(
          <MockedProvider>
            <SelectReposNew {...props} />
          </MockedProvider>,
        );
      });
      describe('when active page is 1', () => {
        it('renders first page of results', () => {
          const repos = component.find(RepoCheckbox);
          expect(repos.length).toBe(reposPerPage);
          expect(repos.at(0).props().id).toBe('1');
          expect(repos.at(1).props().id).toBe('2');
        });
      });

      describe('when active page is 2', () => {
        it('renders second page of results', () => {
          component.find(SelectReposNew).setState({ activePage: 2 });
          const repos = component.find(RepoCheckbox);
          expect(repos.length).toBe(reposPerPage);
          expect(repos.at(0).props().id).toBe('3');
          expect(repos.at(1).props().id).toBe('4');
        });
      });

      describe('when active page is 3', () => {
        it('renders third page of results', () => {
          component.find(SelectReposNew).setState({ activePage: 3 });
          const repos = component.find(RepoCheckbox);
          expect(repos.length).toBe(1);
          expect(repos.at(0).props().id).toBe('5');
        });
      });
    });

    it('renders a <Pagination/> with correct props', () => {
      const component = shallow(<SelectReposNew {...props} />);
      const pagination = component.find(Pagination);
      expect(pagination.length).toBe(1);
      const {
        activePage,
        itemsCountPerPage,
        totalItemsCount,
        pageRangeDisplayed,
        onChange,
      } = pagination.props();

      expect(activePage).toBe(component.state().activePage);
      expect(itemsCountPerPage).toBe(reposPerPage);
      expect(totalItemsCount).toBe(props.data.viewer.watching.edges.length);
      expect(pageRangeDisplayed).toBe(WATCHED_REPOS_PAGINATION_RANGE);
      expect(onChange.toString()).toBe(
        component.instance().handlePageChange.toString(),
      );
    });
  });

  describe('handlePageChange', () => {
    it('sets the activePage to the provided page number', () => {
      const component = shallow(<SelectReposNew {...props} />);
      expect(component.state().activePage).toBe(1);
      component.instance().handlePageChange(2);
      expect(component.state().activePage).toBe(2);
    });
  });

  describe('setFilterValue', () => {
    it('sets the filterValue based on the provided change event', () => {
      const filterValue = 'smeg';
      const component = shallow(<SelectReposNew {...props} />);
      expect(component.state().filterValue).toBe('');
      component.instance().setFilterValue({
        target: {
          value: filterValue,
        },
      });
      expect(component.state().filterValue).toBe(filterValue);
    });

    it('resets the activePage to 1', () => {
      const filterValue = 'smeg';
      const component = shallow(<SelectReposNew {...props} />);
      component.setState({ activePage: 2 });
      component.instance().setFilterValue({
        target: {
          value: filterValue,
        },
      });
      expect(component.state().activePage).toBe(1);
    });
  });

  describe('filtering', () => {
    describe('filter input field', () => {
      it('has onChange set to setFilterValue', () => {
        const component = shallow(<SelectReposNew {...props} />);
        const input = component.find('[data-test-id="filterInput"]');
        expect(input.props().onChange).toBe(
          component.instance().setFilterValue,
        );
      });

      it('has a value controlled by the filter value', () => {
        const filterValue = 'smeg';
        const component = shallow(<SelectReposNew {...props} />);
        component.setState({ filterValue });
        const field = component.find('[data-test-id="filterInput"]');
        expect(field.props().value).toEqual(filterValue);
      });
    });

    describe('when filter value is set', () => {
      it('filters the displayed repos by name', () => {
        const filterValue = watchedRepos.viewer.watching.edges[2].node.name;
        const component = mount(
          <MockedProvider>
            <SelectReposNew {...props} />
          </MockedProvider>,
        );
        component.find(SelectReposNew).setState({ filterValue });
        const repos = component.find(RepoCheckbox);
        expect(repos.length).toBe(1);
        expect(repos.at(0).props().name).toContain(filterValue);
      });
    });
  });

  describe('when there are repos selected', () => {
    it('renders a clear repo selections button', () => {
      const data = cloneDeep(watchedRepos);
      data.viewer.watching.edges[0].node.isSelected = true;

      const component = mount(
        <MockedProvider>
          <SelectReposNew {...props} data={data} loading={false} />
        </MockedProvider>,
      );
      const button = component.find(
        '[data-test-id="clearAllSelectionsButton"]',
      );
      expect(button.length).toBe(1);
    });

    // describe('clear repo selections', () => {
    //   it('dispatches resetSelectedRepos on click', () => {
    //     const resetSelectedRepos = jest.fn();
    //     const component = mount(
    //       <SelectRepos
    //         {...props}
    //         selectedRepos={['MDEwOlJlcG9zaXRvcnk3MDk0NTE5Ng==']}
    //         resetSelectedRepos={resetSelectedRepos}
    //       />,
    //       {
    //         context: mockRouter.getContext(),
    //         childContextTypes: mockRouter.getChildContextTypes(),
    //       },
    //     );
    //     const button = component.find(
    //       '[data-test-id="clearAllSelectionsButton"]',
    //     );
    //     expect(resetSelectedRepos).not.toHaveBeenCalled;
    //     button.simulate('click');
    //     expect(resetSelectedRepos).toHaveBeenCalled;
    //   });
    // });
  });

  describe('when there are no repos selected', () => {
    it('does not render a clear repo selections button', () => {
      const component = mount(
        <MockedProvider>
          <SelectReposNew {...props} loading={false} />
        </MockedProvider>,
      );
      const button = component.find(
        '[data-test-id="clearAllSelectionsButton"]',
      );
      expect(button.length).toBe(0);
    });
  });
});
