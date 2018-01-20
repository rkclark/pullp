import React from 'react';
import { shallow } from 'enzyme';
import Button from '.';

describe('Button', () => {
  const props = {};

  it('renders successfully', () => {
    const component = shallow(<Button {...props} />);
    expect(component.length).toBe(1);
  });

  describe('onClick', () => {
    it('calls onClick function', () => {
      const onClick = jest.fn();
      const component = shallow(<Button {...props} onClick={onClick} />);
      expect(onClick).not.toHaveBeenCalled();
      component.find('button').simulate('click');
      expect(onClick).toHaveBeenCalled();
    });
  });

  it('renders children', () => {
    const children = 'click me';
    const component = shallow(<Button {...props}>{children}</Button>);
    expect(component.text()).toContain(children);
  });
});
