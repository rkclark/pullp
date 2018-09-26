import React from 'react';
import { shallow } from 'enzyme';
import { GetStarted } from '.';

describe('<GetStarted/>', () => {
  it('renders successfully', () => {
    const component = shallow(<GetStarted />);
    expect(component.length).toBe(1);
  });
});
