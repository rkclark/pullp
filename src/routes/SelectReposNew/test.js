import React from 'react';
import { shallow } from 'enzyme';
import Pagination from 'react-js-pagination';
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

    describe('when watched repos data contains 5 repos & repos per page is 2', () => {
      describe('repo pages rendering', () => {
        let component;
        beforeAll(() => {
          component = shallow(<SelectReposNew {...props} />);
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
            component.setState({ activePage: 2 });
            const repos = component.find(RepoCheckbox);
            expect(repos.length).toBe(reposPerPage);
            expect(repos.at(0).props().id).toBe('3');
            expect(repos.at(1).props().id).toBe('4');
          });
        });

        describe('when active page is 3', () => {
          it('renders third page of results', () => {
            component.setState({ activePage: 3 });
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

      describe('handlePageChange', () => {
        it('sets the activePage to the provided page number', () => {
          const component = shallow(<SelectReposNew {...props} />);
          expect(component.state().activePage).toBe(1);
          component.instance().handlePageChange(2);
          expect(component.state().activePage).toBe(2);
        });
      });
    });
  });
});
