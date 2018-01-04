import React from 'react';
import { shallow } from 'enzyme';
import { Redirect } from 'react-router-dom';
import { AccountContainer } from '.';
import SignInForm from './components/SignInForm';
import AccountDetails from './components/AccountDetails';

describe('Account', () => {
  const defaultProps = {
    saveGithubCredentialsAction: () => {},
    githubClientId: null,
    githubClientSecret: null,
    githubToken: null,
    dispatch: () => {},
    login: null,
    avatarUrl: null,
  };

  it('renders successsfully', () => {
    const component = shallow(<AccountContainer {...defaultProps} />);
    expect(component).toHaveLength(1);
  });

  describe('when redirectPath is null', () => {
    it('renders a SignInForm', () => {
      const component = shallow(<AccountContainer {...defaultProps} />);
      expect(component.find(SignInForm).length).toBe(1);
    });
    it('does not render a Redirect', () => {
      const component = shallow(<AccountContainer {...defaultProps} />);
      expect(component.find(Redirect).length).toBe(0);
    });
  });

  describe('when redirectPath is set', () => {
    it('does not render a SignInForm', () => {
      const component = shallow(
        <AccountContainer {...defaultProps} redirectPath="test" />,
      );
      expect(component.find(SignInForm).length).toBe(0);
    });
    it('renders a Redirect', () => {
      const component = shallow(
        <AccountContainer {...defaultProps} redirectPath="test" />,
      );
      expect(component.find(Redirect).length).toBe(1);
    });
  });

  describe('when user is logged in', () => {
    it('renders AccountDetails', () => {
      const component = shallow(
        <AccountContainer
          {...defaultProps}
          login={'test'}
          avatarUrl="testurl"
        />,
      );
      expect(component.find(AccountDetails).length).toBe(1);
    });
    it('does not render  SignInForm', () => {
      const component = shallow(
        <AccountContainer
          {...defaultProps}
          login={'test'}
          avatarUrl="testurl"
        />,
      );
      expect(component.find(SignInForm).length).toBe(0);
    });
  });
});
