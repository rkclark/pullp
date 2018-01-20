import React from 'react';
import { shallow, mount } from 'enzyme';
import { SelectRepos } from './';
import RepoCheckbox from './components/RepoCheckbox';
import Loading from '../../components/Loading';

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
            owner: {
              avatarUrl: 'testurl',
              login: 'testlogin',
            },
            isFork: false,
            createdAt: '2016-10-14T20:31:44Z',
          },
          {
            name: 'test2',
            id: 'MDEwOlJlcG9zaXRvcnk3Mjc1NzkxNg==',
            url: 'url',
            owner: {
              avatarUrl: 'testurl',
              login: 'testlogin',
            },
            isFork: false,
            createdAt: '2016-10-14T20:31:44Z',
          },
        ],
        2: [
          {
            name: 'test3',
            id: 'testid1==',
            url: 'url',
            owner: {
              avatarUrl: 'testurl',
              login: 'testlogin',
            },
            isFork: false,
            createdAt: '2016-10-14T20:31:44Z',
          },
          {
            name: 'test4',
            id: 'testid2==',
            url: 'url',
            owner: {
              avatarUrl: 'testurl',
              login: 'testlogin',
            },
            isFork: false,
            createdAt: '2016-10-14T20:31:44Z',
          },
        ],
        3: [
          {
            name: 'test5',
            id: 'MDEwOlJlcG9zaXRvcnk3MDk0NTE5Ng==',
            url: 'url',
            owner: {
              avatarUrl: 'testurl',
              login: 'testlogin',
            },
            isFork: false,
            createdAt: '2016-10-14T20:31:44Z',
          },
          {
            name: 'test6',
            id: 'MDEwOlJlcG9zaXRvcnk3Mjc1NzkxNg==',
            url: 'url',
            owner: {
              avatarUrl: 'testurl',
              login: 'testlogin',
            },
            isFork: false,
            createdAt: '2016-10-14T20:31:44Z',
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
    const baseProps = {
      ...props,
      paginatedRepos: {
        ...props.paginatedRepos,
        hasPreviousPage: true,
        currentPage: 2,
      },
    };
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
        describe('go to last page button', () => {
          it('renders a previous page button', () => {
            const component = shallow(<SelectRepos {...baseProps} />);
            const previousButton = component.find(
              '[data-test-id="lastPageButton"]',
            );
            expect(previousButton.length).toBe(1);
          });
          it('calls changePage action on click', () => {
            const changeReposPage = jest.fn();
            const component = shallow(
              <SelectRepos
                {...baseProps}
                paginatedRepos={{
                  ...baseProps.paginatedRepos,
                  currentPage: 1,
                }}
                changeReposPage={changeReposPage}
              />,
            );
            component.find('[data-test-id="lastPageButton"]').simulate('click');
            expect(changeReposPage).toHaveBeenCalledWith(3);
          });
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
        describe('go to first page button', () => {
          it('renders a previous page button', () => {
            const component = shallow(<SelectRepos {...baseProps} />);
            const previousButton = component.find(
              '[data-test-id="firstPageButton"]',
            );
            expect(previousButton.length).toBe(1);
          });
          it('calls changePage action on click', () => {
            const changeReposPage = jest.fn();
            const component = shallow(
              <SelectRepos
                {...baseProps}
                paginatedRepos={{
                  ...baseProps.paginatedRepos,
                  currentPage: 3,
                }}
                changeReposPage={changeReposPage}
              />,
            );
            component
              .find('[data-test-id="firstPageButton"]')
              .simulate('click');
            expect(changeReposPage).toHaveBeenCalledWith(1);
          });
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
      const testProps = {
        ...props,
        paginatedRepos: {
          ...props.paginatedRepos,
          hasPreviousPage: false,
          currentPage: null,
          pages: {},
        },
      };
      it('does not render current or total pages', () => {
        const component = shallow(<SelectRepos {...testProps} />);
        const currentPage = component.find('[data-test-id="currentPage"]');
        expect(currentPage.length).toBe(0);
      });
    });

    describe('when loading', () => {
      const testProps = {
        ...props,
        loading: true,
      };
      it('does not render repos', () => {
        const component = shallow(<SelectRepos {...testProps} />);
        expect(component.find(RepoCheckbox).length).toBe(0);
      });

      it('renders loading icon', () => {
        const component = shallow(<SelectRepos {...testProps} />);
        expect(component.find(Loading).length).toBe(1);
      });
    });

    describe('when loaded', () => {
      it('does renders repos', () => {
        const component = shallow(<SelectRepos {...props} />);
        expect(component.find(RepoCheckbox).length).toBe(2);
      });

      it('does not render loading icon', () => {
        const component = shallow(<SelectRepos {...props} />);
        expect(component.find(Loading).length).toBe(0);
      });
    });
  });
});
