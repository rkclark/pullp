import React from 'react';
import { shallow } from 'enzyme';
import { SelectReposNew } from './';
import watchedRepos from './watchedReposFixture';
import RepoCheckbox from '../../components/RepoCheckbox';

const reposPerPage = 2;

describe('<SelectReposNew />', () => {
  const props = {
    data: watchedRepos,
    reposPerPage,
  };

  it('renders succesfully', () => {
    const component = shallow(<SelectReposNew {...props} />);
    expect(component.length).toBe(1);
  });

  describe('when watched repos data contains 5 repos & repos per page is 2', () => {
    let component;
    beforeAll(() => {
      component = shallow(<SelectReposNew {...props} />);
    });
    describe('when current page is 1', () => {
      it('renders first page of results', () => {
        const repos = component.find(RepoCheckbox);
        expect(repos.length).toBe(reposPerPage);
        expect(repos.at(0).props().id).toBe('1');
        expect(repos.at(1).props().id).toBe('2');
      });
    });

    describe('when current page is 2', () => {
      it('renders second page of results', () => {
        component.setState({ currentPage: 2 });
        const repos = component.find(RepoCheckbox);
        expect(repos.length).toBe(reposPerPage);
        expect(repos.at(0).props().id).toBe('3');
        expect(repos.at(1).props().id).toBe('4');
      });
    });

    describe('when current page is 3', () => {
      it('renders third page of results', () => {
        component.setState({ currentPage: 3 });
        const repos = component.find(RepoCheckbox);
        expect(repos.length).toBe(1);
        expect(repos.at(0).props().id).toBe('5');
      });
    });
  });
});
