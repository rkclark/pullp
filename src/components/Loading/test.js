import React from 'react';
import { shallow } from 'enzyme';
import Loading from '.';

describe('Loading', () => {
  const props = {};

  it('renders successfully', () => {
    const component = shallow(<Loading {...props} />);
    expect(component.length).toBe(1);
  });
});
