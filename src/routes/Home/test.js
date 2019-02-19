import React from 'react';
import { shallow } from 'enzyme';
import LoadingMessage from '../../components/LoadingMessage';
import { Home } from '.';
import Repo from './components/Repo';

describe('Home', () => {
  const baseProps = {
    data: [
      {
        id: 1,
        name: 'repo1',
        url: 'url',
        owner: {
          login: 'login',
          avatarUrl: 'avatar',
        },
      },
      {
        id: 2,
        name: 'repo2',
        url: 'url',
        owner: {
          login: 'login',
          avatarUrl: 'avatar',
        },
      },
    ],
    loading: false,
    error: null,
  };

  it('renders successfully', () => {
    const component = shallow(<Home {...baseProps} />);
    expect(component.length).toBe(1);
  });

  it('renders a repo for each repo returned from query', async () => {
    const component = shallow(<Home {...baseProps} />);
    expect(component.find(Repo).length).toBe(2);
  });

  describe('when loading repositories', () => {
    it('renders a loading message', () => {
      const component = shallow(<Home {...baseProps} loading />);
      expect(component.find(LoadingMessage).length).toBe(1);
    });
  });

  describe('when not loading repositories', () => {
    it('does not render a loading message', () => {
      const component = shallow(<Home {...baseProps} />);
      expect(component.find(LoadingMessage).length).toBe(0);
    });
  });

  describe('when there is an error', () => {
    it('shows a warning message', () => {
      const component = shallow(
        <Home {...baseProps} error={{ message: 'err' }} />,
      );
      expect(component.find('.updateWarning').length).toBe(1);
    });
  });

  describe('when there is not an error', () => {
    it('does not show a warning message', () => {
      const component = shallow(<Home {...baseProps} />);
      expect(component.find('.updateWarning').length).toBe(0);
    });
  });

  describe('toggleOpenRepo()', () => {
    describe('when repo is not already open', () => {
      it('saves repo id as the currently open repo', () => {
        const componentInstance = shallow(<Home {...baseProps} />).instance();
        const repoId = 'test';
        componentInstance.toggleOpenRepo(repoId);
        expect(componentInstance.state.openRepoId).toBe(repoId);
      });
    });

    describe('when repo is already open', () => {
      it('saves repo id as the currently open repo', () => {
        const componentInstance = shallow(<Home {...baseProps} />).instance();

        const repoId = 'test';
        componentInstance.setState({ openRepoId: repoId });
        componentInstance.toggleOpenRepo(repoId);
        expect(componentInstance.state.openRepoId).toBeNull();
      });
    });
  });
});
