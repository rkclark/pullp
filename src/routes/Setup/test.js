import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';
import { SetupContainer } from '.';
import SignInForm from './components/SignInForm';
import Error from '../../components/Error';
import Loading from '../../components/Loading';

describe('Setup', () => {
  const defaultProps = {
    githubCurrentUserError: null,
    githubToken: null,
    dispatch: () => {},
    login: null,
    requestCurrentUser: () => {},
    loadingGithubToken: false,
  };

  it('renders successsfully', () => {
    const component = shallow(<SetupContainer {...defaultProps} />);
    expect(component).toHaveLength(1);
  });

  describe('when not loading github token', () => {
    it('renders a SignInForm', () => {
      const component = shallow(
        <SetupContainer {...defaultProps} loadingGithubToken={false} />,
      );
      expect(component.find(SignInForm).length).toBe(1);
    });
  });

  describe('when loading github token', () => {
    it('does not render a SignInForm', () => {
      const component = shallow(
        <SetupContainer {...defaultProps} loadingGithubToken />,
      );
      expect(component.find(SignInForm).length).toBe(0);
    });
  });

  describe('componentWillReceiveProps', () => {
    describe('when props show current user can be requested and auto request has not yet occured', () => {
      it('dispatches requestCurrentUser action', () => {
        const requestCurrentUser = jest.fn();
        const nextProps = {
          githubToken: 'test',
          login: null,
          currentUserLoading: false,
        };
        const component = shallow(
          <SetupContainer
            {...defaultProps}
            requestCurrentUser={requestCurrentUser}
          />,
        );
        expect(requestCurrentUser).not.toHaveBeenCalled();
        component.instance().componentWillReceiveProps(nextProps);
        expect(requestCurrentUser).toHaveBeenCalledWith(nextProps.githubToken);
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
      expect(component.find(Link).props().to).toEqual('/app/selectRepos');
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
        const token = 'testToken';
        const component = shallow(
          <SetupContainer
            {...defaultProps}
            githubCurrentUserError={'error'}
            requestCurrentUser={requestCurrentUser}
            githubToken={token}
          />,
        );
        expect(requestCurrentUser).not.toBeCalled();
        component.find('[data-test-id="try-again-button"]').simulate('click');
        expect(requestCurrentUser).toBeCalledWith(token);
      });
    });

    describe('when the current user is loading', () => {
      it('renders a Loading component', () => {
        const component = shallow(
          <SetupContainer {...defaultProps} currentUserLoading />,
        );
        expect(component.find(Loading).length).toBe(1);
      });
    });

    describe('when the current user is not loading', () => {
      it('does not render a Loading component', () => {
        const component = shallow(
          <SetupContainer {...defaultProps} currentUserLoading={false} />,
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

  describe('when the github token is loading', () => {
    it('renders a Loading component', () => {
      const component = shallow(
        <SetupContainer {...defaultProps} loadingGithubToken />,
      );
      expect(component.find(Loading).length).toBe(1);
    });
  });

  describe('when the github token is not loading', () => {
    it('does not render a Loading component', () => {
      const component = shallow(
        <SetupContainer {...defaultProps} loadingGithubToken={false} />,
      );
      expect(component.find(Loading).length).toBe(0);
    });
  });
});
