/* eslint-disable global-require */
import React from 'react';
import { shallow } from 'enzyme';
import { Redirect } from 'react-router-dom';
import { LoginContainer } from './';

jest.mock('./helpers/githubAuth', () => jest.fn(() => 42));

describe('LoginContainer', () => {
  const props = {
    saveGithubCredentialsAction: () => {},
    githubClientId: 'id',
    githubClientSecret: 'secret',
    redirectPath: null,
    dispatch: () => {},
  };
  it('renders successfully,', () => {
    const component = shallow(<LoginContainer {...props} />);
    expect(component.length).toBe(1);
  });
  describe('when redirect is present', () => {
    it('renders a Redirect', () => {
      const path = '/path';
      const component = shallow(
        <LoginContainer {...props} redirectPath={path} />,
      );
      expect(component.find(Redirect).length).toBe(1);
      expect(component.find(Redirect).props().to).toBe(path);
    });
  });
  describe('when github client id and secret are present', () => {
    it('renders signin button', () => {
      const component = shallow(<LoginContainer {...props} />);
      expect(component.find('[data-test-id="signInButton"]').length).toBe(1);
    });

    describe('when sign in button clicked', () => {
      it('calls githubAuth helper', () => {
        const githubAuth = require('./helpers/githubAuth');
        const component = shallow(<LoginContainer {...props} />);
        component.find('[data-test-id="signInButton"]').simulate('click');

        expect(githubAuth.mock.calls[0]).toEqual([
          props.githubClientId,
          props.githubClientSecret,
          props.dispatch,
        ]);
      });
    });
  });
});
