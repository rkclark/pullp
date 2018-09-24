import React from 'react';
import ReactRouterEnzymeContext from 'react-router-enzyme-context';
import { shallow, mount } from 'enzyme';
import SetupNew from './';

import SignInForm from '../../components/SignInForm';

describe('Setup', () => {
  it('renders successfully', () => {
    const component = shallow(<SetupNew />);
    expect(component.length).toBe(1);
  });

  describe('when path is /setup/sign-in', () => {
    it('Renders sign in form', () => {
      const mockRouter = new ReactRouterEnzymeContext({
        initialEntries: ['/app/setup/sign-in'],
      });
      const component = mount(
        <SetupNew {...mockRouter.props()} />,
        mockRouter.get(),
      );
      expect(component.find(SignInForm).length).toBe(1);
    });
  });
});
