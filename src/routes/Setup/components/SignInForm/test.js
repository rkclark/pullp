import React from 'react';
import { shallow, mount } from 'enzyme';
import SignInForm from '.';
import * as githubAuth from '../../helpers/githubAuth';

const authMock = jest.fn();
githubAuth.default = authMock;

describe('SignInForm', () => {
  const defaultProps = {
    saveGithubCredentials: () => {},
    githubClientId: null,
    githubClientSecret: null,
    githubToken: null,
    dispatch: () => {},
  };

  it('renders successsfully', () => {
    const component = shallow(<SignInForm {...defaultProps} />);
    expect(component).toHaveLength(1);
  });

  describe('when githubClientId is null', () => {
    it('renders github id and secret input fields', () => {
      const component = shallow(<SignInForm {...defaultProps} />);
      const inputs = component.find('input');
      expect(inputs.at(0).props().name).toBe('githubClientId');
      expect(inputs.at(1).props().name).toBe('githubClientSecret');
    });
  });

  describe('when githubclientId and githubClientSecret are present but githubToken is null', () => {
    it('renders github sign in button', () => {
      const component = shallow(
        <SignInForm
          {...defaultProps}
          githubClientId="test"
          githubClientSecret="test"
        />,
      );
      const button = component.find('button');
      expect(button.text()).toBe('Sign in with Github');
    });

    it('does not render github id and secret input fields', () => {
      const component = shallow(
        <SignInForm
          {...defaultProps}
          githubClientId="test"
          githubClientSecret="test"
        />,
      );
      const inputs = component.find('input');
      expect(inputs.length).toBe(0);
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
        component.find('button').simulate('click');
        expect(authMock).toHaveBeenCalledWith(
          id,
          secret,
          defaultProps.dispatch,
        );
      });
    });
  });

  describe('when githubClientId and githubClientSecret fields filled in and save button clicked', () => {
    it('calls the saveGithubCredentials action with the entered credentials', () => {
      const props = {
        ...defaultProps,
        saveGithubCredentials: jest.fn(),
      };
      const creds = {
        githubClientSecret: 'githubClientSecretTest',
        githubClientId: 'githubClientIdTest',
      };
      const mountedComponent = mount(<SignInForm {...props} />);
      mountedComponent.find('[name="githubClientId"]').node.value =
        creds.githubClientId;
      mountedComponent.find('[name="githubClientSecret"]').node.value =
        creds.githubClientSecret;
      mountedComponent.find('button').simulate('click');
      expect(props.saveGithubCredentials).toHaveBeenCalledWith(creds);
    });
  });

  describe('when githubClientId and githubClientSecret fields are not filled in and save button clicked', () => {
    it('does nothing', () => {
      const props = {
        ...defaultProps,
        saveGithubCredentials: jest.fn(),
      };
      const mountedComponent = mount(<SignInForm {...props} />);
      mountedComponent.find('button').simulate('click');
      expect(props.saveGithubCredentials).not.toHaveBeenCalled();
    });
  });
});
