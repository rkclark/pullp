import React from 'react';
import { shallow, mount } from 'enzyme';
import ErrorBoundary from './';
import ErrorComponent from '../Error';

describe('<ErrorBoundary />', () => {
  const child = <p>child</p>;

  const props = {
    children: child,
  };

  it('renders children by default', () => {
    const component = shallow(<ErrorBoundary {...props} />);
    expect(component.contains(child)).toBe(true);
  });

  it('does not render an error by default', () => {
    const component = shallow(<ErrorBoundary {...props} />);
    expect(component.find(Error).length).toBe(0);
  });

  describe('when a child component throws an error with a message', () => {
    let component;

    const ErrorChild = () => {
      throw new Error('Test');
    };

    /* eslint-disable no-console */

    // Mock out console.error to stop React logging the error from ErrorChild
    const originalConsoleError = console.error;

    beforeAll(() => {
      console.error = () => {};
    });

    afterAll(() => {
      console.error = originalConsoleError;
    });

    /* eslint-enable no-console */

    beforeEach(() => {
      component = mount(
        <ErrorBoundary {...props}>
          <ErrorChild />
        </ErrorBoundary>,
      );
    });

    it('renders an Error component with the right message', () => {
      const errorWrapper = component.find(ErrorComponent);
      expect(errorWrapper.props().message).toBe('Test');
    });

    it('does not render children', () => {
      expect(component.contains(child)).toBe(false);
    });
  });

  describe('when a child component throws an error without a message', () => {
    let component;

    const ErrorChild = () => {
      throw new Error();
    };

    /* eslint-disable no-console */

    // Mock out console.error to stop React logging the error from ErrorChild
    const originalConsoleError = console.error;

    beforeAll(() => {
      console.error = () => {};
    });

    afterAll(() => {
      console.error = originalConsoleError;
    });

    /* eslint-enable no-console */

    beforeEach(() => {
      component = mount(
        <ErrorBoundary {...props}>
          <ErrorChild />
        </ErrorBoundary>,
      );
    });

    it('renders an Error component with the default message', () => {
      const errorWrapper = component.find(ErrorComponent);
      expect(errorWrapper.props().message).toBe(
        'Oh no! Pullp encountered an error. Try refreshing the app with CMD+R or CTRL+R',
      );
    });
  });
});
