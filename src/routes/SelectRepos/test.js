import React from 'react';
import { shallow, mount } from 'enzyme';
import { SelectRepos } from './';
import RepoCheckbox from './components/RepoCheckbox';

describe('SelectRepos', () => {
  const props = {
    githubError: null,
    requestWatchedRepos: jest.fn(),
    toggleRepoSelection: () => {},
    filterRepos: () => {},
  };

  xit('renders successfully', () => {
    const component = shallow(<SelectRepos {...props} />);
    expect(component).toHaveLength(1);
  });

  xit('renders a RepoCheckbox for each watched repo', () => {
    const component = shallow(
      <SelectRepos
        {...props}
        watchedRepos={[
          {
            name: 'Repo1',
            id: 'hjhgjhjgh==',
            url: 'test',
          },
          {
            name: 'Repo2',
            id: 'gdfdshgfghfgh==',
            url: 'test2',
          },
        ]}
      />,
    );
    expect(component.find(RepoCheckbox)).toHaveLength(2);
  });

  xit('calls requestWatchedRepos when mounted', () => {
    const component = mount(<SelectRepos {...props} />);
    expect(component.requestWatchedRepos).toHaveBeenCalled;
  });

  xdescribe('filtering', () => {
    describe('filter input field', () => {
      it('calls filterRepos on change', () => {
        const testValue = 'omg';
        const filterRepos = jest.fn();
        const component = shallow(
          <SelectRepos {...props} filterRepos={filterRepos} />,
        );
        component
          .find('[data-test-id="filterInput"]')
          .simulate('change', { target: { value: testValue } });
        expect(filterRepos).toHaveBeenCalledWith(testValue);
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

    const testName1 = 'jjjjjjtestkkkkkk';
    const testName2 = 'test ......h.h..h.h.';
    const watchedRepos = [
      {
        name: 'hhyhhyh oopopopo',
        id: 'hjhgjhjgh==',
        url: 'test',
      },
      {
        name: testName1,
        id: 'gdfdshgfghfgh==',
        url: 'test2',
      },
      {
        name: testName2,
        id: 'gdfdshgfghfgh==',
        url: 'test2',
      },
    ];
    describe('when filter value is set', () => {
      it('only displays checkboxes for repos that contain the value in their name', () => {
        const filterValue = 'test';
        const component = shallow(
          <SelectRepos
            {...props}
            watchedRepos={watchedRepos}
            repoFilterValue={filterValue}
          />,
        );
        const repos = component.find(RepoCheckbox);
        expect(repos.at(0).props().name).toEqual(testName1);
        expect(repos.at(1).props().name).toEqual(testName2);
        expect(repos.length).toBe(2);
      });
    });
    describe('when filter value is empty', () => {
      it('renders all repo checkboxes', () => {
        const component = shallow(
          <SelectRepos {...props} watchedRepos={watchedRepos} />,
        );
        const repos = component.find(RepoCheckbox);
        expect(repos.length).toBe(3);
      });
    });
  });
});
