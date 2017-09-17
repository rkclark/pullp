import React from 'react';
import { shallow } from 'enzyme';
import RepoCheckbox from './';

describe('RepoCheckbox', () => {
  const props = {
    name: 'testRepo',
  };

  it('renders successfully', () => {
    const component = shallow(<RepoCheckbox {...props} />);
    expect(component).toHaveLength(1);
  });

  it('displays name of repo', () => {
    const component = shallow(<RepoCheckbox {...props} />);
    expect(component.text()).toContain(props.name);
  });
});
