import React from 'react';
import { shallow } from 'enzyme';
import App from '.';

describe('<App/>', () => {
  let component;

  beforeEach(() => {
    component = shallow(<App />);
  });

  it('renders successfully', () => {
    expect(component).toHaveLength(1);
  });

  it('renders a logo', () => {
    expect(component.find('.logo')).toHaveLength(1);
  });
});
