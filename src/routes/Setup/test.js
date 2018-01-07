import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';
import { SetupContainer } from '.';
import SignInForm from './components/SignInForm';

describe('Setup', () => {
  const defaultProps = {
    saveGithubCredentialsAction: () => {},
    githubClientId: null,
    githubClientSecret: null,
    githubToken: null,
    dispatch: () => {},
    login: null,
    requestCurrentUser: () => {},
  };

  it('renders successsfully', () => {
    const component = shallow(<SetupContainer {...defaultProps} />);
    expect(component).toHaveLength(1);
  });

  it('renders a SignInForm', () => {
    const component = shallow(<SetupContainer {...defaultProps} />);
    expect(component.find(SignInForm).length).toBe(1);
  });

  describe('progress bar', () => {
    it('sets active class on step 1', () => {
      const component = shallow(<SetupContainer {...defaultProps} />);
      expect(component.find('.stepOne').hasClass('activeStep')).toBe(true);
    });

    describe('when github client id is set', () => {
      it('sets active class step 2', () => {
        const component = shallow(
          <SetupContainer {...defaultProps} githubClientId="test" />,
        );
        expect(component.find('.stepTwo').hasClass('activeStep')).toBe(true);
      });
    });

    describe('when github client id is not set', () => {
      it('does not set active class step 2', () => {
        const component = shallow(<SetupContainer {...defaultProps} />);
        expect(component.find('.stepTwo').hasClass('activeStep')).toBe(false);
      });
    });

    describe('when github token is set', () => {
      it('sets active class step 3', () => {
        const component = shallow(
          <SetupContainer {...defaultProps} githubToken="test" />,
        );
        expect(component.find('.stepThree').hasClass('activeStep')).toBe(true);
      });
    });

    describe('when github token is not set', () => {
      it('does not set active class step 3', () => {
        const component = shallow(<SetupContainer {...defaultProps} />);
        expect(component.find('.stepThree').hasClass('activeStep')).toBe(false);
      });
    });
  });

  describe('componentWillUpdate', () => {
    describe('when current user login is not present and github token is present', () => {
      it('dispatches requestCurrentUser action', () => {
        const requestCurrentUser = jest.fn();
        const component = shallow(
          <SetupContainer
            {...defaultProps}
            requestCurrentUser={requestCurrentUser}
            githubToken={'test'}
          />,
        );
        expect(requestCurrentUser).not.toHaveBeenCalled();
        component.setProps({});
        expect(requestCurrentUser).toHaveBeenCalled();
      });
    });
  });

  describe('when current user login is present', () => {
    it('renders a link to selectRepos', () => {
      const component = shallow(
        <SetupContainer {...defaultProps} login={'test'} />,
      );
      expect(component.find(Link).props().to).toEqual('/selectRepos');
    });

    it("renders user's login", () => {
      const login = 'vanDamme';
      const component = shallow(
        <SetupContainer {...defaultProps} login={login} />,
      );
      expect(component.text()).toContain(login);
    });
  });
});
