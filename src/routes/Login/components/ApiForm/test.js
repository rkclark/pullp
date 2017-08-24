import React from 'react';
import { shallow } from 'enzyme';
import ApiForm from '.';

describe('ApiForm', () => {
  let component;
  beforeEach(() => {
    component = shallow(<ApiForm />);
  });

  it('renders successsfully', () => {
    expect(component).toHaveLength(1);
  });
});
