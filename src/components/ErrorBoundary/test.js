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

  describe('when getDerivedStateFromError catches an error', () => {
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

    it('renders an Error component', () => {
      expect(component.find(ErrorComponent).length).toBe(1);
    });

    it('does not render children', () => {
      expect(component.contains(child)).toBe(false);
    });
  });
});
