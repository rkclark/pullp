import React from 'react';
import { shallow } from 'enzyme';
import CurrentUser from './';

describe('CurrentUser', () => {
  const props = {
    login: 'test',
    avatarUrl: 'test',
  };

  it('renders successfully', () => {
    const component = shallow(<CurrentUser {...props} />);
    expect(component).toHaveLength(1);
  });
});
