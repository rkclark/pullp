import React from 'react';
import { shallow } from 'enzyme';
import MinimalView from '.';
import Repo from '../Repo';

describe('MinimalView', () => {
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
    openRepoId: '1',
    toggleOpenRepo: () => {},
  };

  it('renders successfully', () => {
    const component = shallow(<MinimalView {...baseProps} />);
    expect(component.length).toBe(1);
  });

  it('renders a repo for each repo in the data', async () => {
    const component = shallow(<MinimalView {...baseProps} />);
    expect(component.find(Repo).length).toBe(2);
  });

  it('passes required props to each repo', () => {
    const component = shallow(<MinimalView {...baseProps} />);
    expect(component.find(Repo).length).toBe(2);

    const repoProps = component
      .find(Repo)
      .at(0)
      .props();

    expect(repoProps.toggleOpenRepo).toBe(baseProps.toggleOpenRepo);
    expect(repoProps.openRepoId).toBe(baseProps.openRepoId);
  });
});
