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
});
