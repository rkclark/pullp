import React from 'react';
import { shallow } from 'enzyme';
import Error from '.';

describe('Error', () => {
  const props = {};
  it('renders successfully', () => {
    const component = shallow(<Error {...props} />);
    expect(component.length).toBe(1);
  });

  describe('when not passed a specific message', () => {
    it('renders a default message', () => {
      const component = shallow(<Error {...props} />);
      expect(component.find('.message').text()).toEqual(
        'Oh no! Pullp encountered an error. Try refreshing the app with CMD+R or CTRL+R',
      );
    });
  });

  describe('when passed a specific message', () => {
    it('renders the message', () => {
      const message = 'doh!';
      const component = shallow(<Error {...props} message={message} />);
      expect(component.find('.message').text()).toEqual(message);
    });
  });

  describe('when not passed a specific title', () => {
    it('renders a default title', () => {
      const component = shallow(<Error {...props} />);
      expect(component.find('.title').text()).toEqual('Error');
    });
  });

  describe('when passed a specific title', () => {
    it('renders the title', () => {
      const title = 'doh!';
      const component = shallow(<Error {...props} title={title} />);
      expect(component.find('.title').text()).toEqual(title);
    });
  });
});
