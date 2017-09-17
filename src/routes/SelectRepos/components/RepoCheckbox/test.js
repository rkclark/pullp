import React from 'react';
import { shallow } from 'enzyme';
import RepoCheckbox from './';

describe('RepoCheckbox', () => {
  const props = {
    name: 'testRepo',
    checked: true,
    onChange: jest.fn(),
    id: 'test',
    url: 'testurl',
  };

  it('renders successfully', () => {
    const component = shallow(<RepoCheckbox {...props} />);
    expect(component).toHaveLength(1);
  });

  it('displays name of repo', () => {
    const component = shallow(<RepoCheckbox {...props} />);
    expect(component.text()).toContain(props.name);
  });

  describe('when clicked', () => {
    it('calls onChange function', () => {
      const component = shallow(<RepoCheckbox {...props} />);
      component.find('input').simulate('change');
      expect(props.onChange).toHaveBeenCalled();
    });
  });
});
