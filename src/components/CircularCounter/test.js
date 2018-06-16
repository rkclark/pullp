import React from 'react';
import { shallow } from 'enzyme';
import CircularCounter from '.';

describe('Circular Counter', () => {
  const props = {
    count: 1,
  };

  it('renders succcessfully', () => {
    const component = shallow(<CircularCounter {...props} />);
    expect(component.length).toBe(1);
  });

  it('renders the provided count', () => {
    const component = shallow(<CircularCounter {...props} />);
    expect(component.text()).toContain(props.count);
  });
});
