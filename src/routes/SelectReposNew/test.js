import React from 'react';
import { shallow } from 'enzyme';
import { SelectReposNew } from './';

describe('<SelectReposNew />', () => {
  it('renders succesfully', () => {
    const component = shallow(<SelectReposNew />);
    expect(component.length).toBe(1);
  });
});
