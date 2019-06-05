import React from 'react';
import { shallow } from 'enzyme';
import FullView from '.';
import Repo from '../Repo';

describe('FullView', () => {
  const baseProps = {
    data: [
      {
        id: '1',
        name: 'repo1',
        url: 'url',
        owner: {
          login: 'login',
          avatarUrl: 'avatar',
        },
      },
      {
        id: '2',
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
    const component = shallow(<FullView {...baseProps} />);
    expect(component.length).toBe(1);
  });

  it('renders a repo for each repo in the data', async () => {
    const component = shallow(<FullView {...baseProps} />);
    expect(component.find(Repo).length).toBe(2);
  });

  it('passes required props to each repo', () => {
    const component = shallow(<FullView {...baseProps} />);
    expect(component.find(Repo).length).toBe(2);

    const repoProps = component
      .find(Repo)
      .at(0)
      .props();

    expect(repoProps.toggleOpenRepo).toBe(baseProps.toggleOpenRepo);
    expect(repoProps.openRepoId).toBe(baseProps.openRepoId);
  });
});
