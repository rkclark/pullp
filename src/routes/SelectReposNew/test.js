import React from 'react';
import { shallow } from 'enzyme';
import { SelectReposNew } from './';
import watchedRepos from './watchedReposFixture';
import RepoCheckbox from '../../components/RepoCheckbox';

describe('<SelectReposNew />', () => {
  const props = {
    data: watchedRepos,
  };

  it('renders succesfully', () => {
    const component = shallow(<SelectReposNew {...props} />);
    expect(component.length).toBe(1);
  });

  it('renders a <RepoCheckbox/> for each watched repo', () => {
    const component = shallow(<SelectReposNew {...props} />);
    expect(component.find(RepoCheckbox).length).toBe(
      props.data.viewer.watching.edges.length,
    );
  });
});
