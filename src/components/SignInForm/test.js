import React from 'react';
import { shallow } from 'enzyme';
import SignInForm from '.';
import * as githubAuth from '../../routes/Setup/helpers/githubAuthNew';
import Button from '../Button';

const authMock = jest.fn();
githubAuth.default = authMock;

describe('SignInForm', () => {
  const defaultProps = {
    saveGithubToken: () => {},
  };

  let component;

  beforeEach(() => {
    component = shallow(<SignInForm {...defaultProps} />);
  });

  it('renders successsfully', () => {
    expect(component).toHaveLength(1);
  });

  it('renders github sign in button', () => {
    const button = component.find(Button).at(0);
    expect(button.props().children).toBe('Sign in with Github');
  });

  describe('when sign in button is clicked', () => {
    it('calls githubAuth function', () => {
      expect(authMock).not.toHaveBeenCalled();
      component
        .find(Button)
        .at(0)
        .simulate('click');
      expect(authMock).toHaveBeenCalledWith(defaultProps.saveGithubToken);
    });
  });
});
