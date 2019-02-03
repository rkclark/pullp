import React from 'react';
import { shallow } from 'enzyme';
import LoadingIcon from '.';

describe('LoadingIcon', () => {
  const props = {};

  it('renders successfully', () => {
    const component = shallow(<LoadingIcon {...props} />);
    expect(component.length).toBe(1);
  });
});
