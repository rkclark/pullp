import React from 'react';
import { shallow } from 'enzyme';
import LoadingMessage from './';
import LoadingIcon from '../LoadingIcon';

describe('<LoadingMessage />', () => {
  let component;
  const message = 'test';
  beforeAll(() => {
    component = shallow(<LoadingMessage message={message} />);
  });

  it('renders successfully', () => {
    expect(component.length).toBe(1);
  });

  it('renders a <LoadingIcon />', () => {
    expect(component.find(LoadingIcon).length).toBe(1);
  });

  it('renders provided message', () => {
    expect(component.text()).toContain(message);
  });
});
