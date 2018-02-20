import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';
import { SetupContainer } from '.';
import SignInForm from './components/SignInForm';
import Error from '../../components/Error';
import Loading from '../../components/Loading';

describe('Setup', () => {
  const defaultProps = {
    saveGithubCredentialsAction: () => {},
    githubClientId: null,
    githubClientSecret: null,
    githubCurrentUserError: null,
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

  describe('componentWillReceiveProps', () => {
    describe('when props show current user can be requested and auto request has not yet occured', () => {
      it('dispatches requestCurrentUser action', () => {
        const requestCurrentUser = jest.fn();
        const component = shallow(
          <SetupContainer
            {...defaultProps}
            requestCurrentUser={requestCurrentUser}
          />,
        );
        expect(requestCurrentUser).not.toHaveBeenCalled();
        component.instance().componentWillReceiveProps({
          githubToken: 'test',
          login: null,
          currentUserLoading: false,
        });
        expect(requestCurrentUser).toHaveBeenCalled();
      });
      it('updates autoRequestCurrentUser to true in component state', async () => {
        const requestCurrentUser = () => {};
        const component = shallow(
          <SetupContainer
            {...defaultProps}
            requestCurrentUser={requestCurrentUser}
          />,
        );
        expect(component.state().autoRequestedCurrentUser).toBe(false);
        await component.instance().componentWillReceiveProps({
          githubToken: 'test',
          login: null,
          currentUserLoading: false,
        });
        expect(component.state().autoRequestedCurrentUser).toBe(true);
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

  describe('when there is a login error', () => {
    it('renders an error component', () => {
      const component = shallow(
        <SetupContainer {...defaultProps} loginError={'error'} />,
      );
      const error = component.find(Error);
      expect(error.length).toBe(1);
      expect(error.props().message).toEqual('Github sign in failed.');
    });
  });
  describe('when there is not a login error', () => {
    it('does not render an error component', () => {
      const component = shallow(<SetupContainer {...defaultProps} />);
      expect(component.find(Error).length).toBe(0);
    });
  });

  describe('when there is a githubCurrentUserError error', () => {
    it('renders an error component', () => {
      const component = shallow(
        <SetupContainer {...defaultProps} githubCurrentUserError={'error'} />,
      );
      const error = component.find(Error);
      expect(error.length).toBe(1);
      expect(error.props().message).toEqual(
        'Error requesting your user profile from Github.',
      );
    });

    describe('try again button on click', () => {
      it('dispatches requestCurrentUser action', () => {
        const requestCurrentUser = jest.fn();
        const component = shallow(
          <SetupContainer
            {...defaultProps}
            githubCurrentUserError={'error'}
            requestCurrentUser={requestCurrentUser}
          />,
        );
        expect(requestCurrentUser).not.toBeCalled();
        component.find('[data-test-id="try-again-button"]').simulate('click');
        expect(requestCurrentUser).toBeCalled();
      });
    });

    describe('when the current user is loading', () => {
      it('renders a Loading component', () => {
        const component = shallow(
          <SetupContainer
            {...defaultProps}
            githubCurrentUserError={'error'}
            currentUserLoading
          />,
        );
        expect(component.find(Loading).length).toBe(1);
      });
    });

    describe('when the current user is not loading', () => {
      it('does not render a Loading component', () => {
        const component = shallow(
          <SetupContainer
            {...defaultProps}
            githubCurrentUserError={'error'}
            currentUserLoading={false}
          />,
        );
        expect(component.find(Loading).length).toBe(0);
      });
    });
  });

  describe('when there is not a githubCurrentUserError error', () => {
    it('does not render an error component', () => {
      const component = shallow(<SetupContainer {...defaultProps} />);
      expect(component.find(Error).length).toBe(0);
    });
  });
});
