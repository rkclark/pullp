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
    owner: {
      avatarUrl: 'testurl',
      login: 'testlogin',
    },
    isFork: false,
    createdAt: '2016-10-14T20:31:44Z',
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

  describe('when repo is a fork', () => {
    it('renders "(fork)" in repo name', () => {
      const component = shallow(<RepoCheckbox {...props} isFork />);
      expect(component.find('.name').text()).toContain('(fork)');
    });
  });

  describe('when repo is not a fork', () => {
    it('does not render "(fork)" in repo name', () => {
      const component = shallow(<RepoCheckbox {...props} />);
      expect(component.find('.name').text()).not.toContain('(fork)');
    });
  });

  it('renders created at date in correct format', () => {
    const component = shallow(<RepoCheckbox {...props} />);
    expect(component.find('.date').text()).toContain('14 Oct 2016');
  });
});
