import React from 'react';
import { shallow } from 'enzyme';
import SignInForm from '.';
import * as githubAuth from '../../helpers/githubAuth';
import Button from '../../../../components/Button';

const authMock = jest.fn();
githubAuth.default = authMock;

describe('SignInForm', () => {
  const defaultProps = {
    githubToken: null,
    dispatch: () => {},
    logout: () => {},
  };

  it('renders successsfully', () => {
    const component = shallow(<SignInForm {...defaultProps} />);
    expect(component).toHaveLength(1);
  });

  describe('when githubToken is null', () => {
    it('renders github sign in button', () => {
      const component = shallow(
        <SignInForm
          {...defaultProps}
          githubClientId="test"
          githubClientSecret="test"
        />,
      );
      const button = component.find(Button).at(0);
      expect(button.props().children).toBe('Sign in with Github');
    });

    describe('when sign in button is clicked', () => {
      it('calls githubAuth function', () => {
        expect(authMock).not.toHaveBeenCalled();
        const id = 'test';
        const secret = 'test';
        const component = shallow(
          <SignInForm
            {...defaultProps}
            githubClientId={id}
            githubClientSecret={secret}
          />,
        );
        component
          .find(Button)
          .at(0)
          .simulate('click');
        expect(authMock).toHaveBeenCalledWith(defaultProps.dispatch);
      });
    });
  });
});
