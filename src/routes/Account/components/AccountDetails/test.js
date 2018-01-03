import React from 'react';
import { shallow } from 'enzyme';
import AccountDetails from '.';

describe('AccountDetails', () => {
  const props = {
    login: 'test',
    avatarUrl: 'test.com',
  };

  it('renders successsfully', () => {
    const component = shallow(<AccountDetails {...props} />);
    expect(component).toHaveLength(1);
  });

  it('renders login name', () => {
    const component = shallow(<AccountDetails {...props} />);
    expect(component.text()).toContain(props.login);
  });

  it('renders avatar', () => {
    const component = shallow(<AccountDetails {...props} />);
    expect(component.find('img').props().src).toBe(props.avatarUrl);
  });
});
