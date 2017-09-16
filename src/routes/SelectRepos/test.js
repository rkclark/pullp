import React from 'react';
import { shallow } from 'enzyme';
import SelectRepos from './';

describe('SelectRepos', () => {
  const props = {};

  it('renders successfully', () => {
    const component = shallow(<SelectRepos {...props} />);
    expect(component).toHaveLength(1);
  });
});
