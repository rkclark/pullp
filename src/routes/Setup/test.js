import React from 'react';
import { shallow } from 'enzyme';
import { Setup } from './';

import SignInForm from '../../components/SignInForm';
import GetStartedContainer from '../../components/GetStarted';

describe('Setup', () => {
  const defaultProps = {
    data: {},
    client: {},
  };

  it('renders successfully', () => {
    const component = shallow(<Setup {...defaultProps} />);
    expect(component.length).toBe(1);
  });

  describe('when apollo data does not contain github auth token', () => {
    let component;
    const clientMock = {
      writeData: jest.fn(),
    };
    const data = {
      githubAuth: {
        token: null,
        loadingToken: false,
        error: null,
      },
    };

    beforeAll(() => {
      component = shallow(<Setup data={data} client={clientMock} />);
    });

    afterEach(() => {
      clientMock.writeData.mockClear();
    });

    it('renders a <SignInForm/> with correct props', async () => {
      const signInForm = component.find(SignInForm);
      const props = signInForm.props();
      expect(signInForm.length).toBe(1);
      expect(props.loadingToken).toBe(data.githubAuth.loadingToken);
      expect(props.error).toBe(data.githubAuth.error);
    });

    it('does not render a <GetStartedContainer/> component', () => {
      expect(component.find(GetStartedContainer).length).toBe(0);
    });

    describe('saveGithubToken fn passed to <SignInForm/> as a prop', () => {
      it('writes github token to apollo client + sets loading false', () => {
        const token = '1234';
        const saveGithubToken = component.find(SignInForm).props()
          .saveGithubToken;

        expect(clientMock.writeData).not.toBeCalled;
        saveGithubToken(token);
        expect(clientMock.writeData).toHaveBeenLastCalledWith({
          data: {
            githubAuth: {
              token,
              loadingToken: false,
              __typename: 'GithubAuth',
            },
          },
        });
      });

      describe('setLoadingToken fn passed to <SignInForm/> as a prop', () => {
        it('sets token loading state to true and error to null', () => {
          const setLoadingToken = component.find(SignInForm).props()
            .setLoadingToken;

          expect(clientMock.writeData).not.toBeCalled;
          setLoadingToken();
          expect(clientMock.writeData).toHaveBeenLastCalledWith({
            data: {
              githubAuth: {
                loadingToken: true,
                error: null,
                __typename: 'GithubAuth',
              },
            },
          });
        });
      });

      describe('saveTokenError fn passed to <SignInForm/> as a prop', () => {
        it('saves token error message and sets loading to false', () => {
          const error = 'Borked';
          const saveTokenError = component.find(SignInForm).props()
            .saveTokenError;

          expect(clientMock.writeData).not.toBeCalled;
          saveTokenError(error);
          expect(clientMock.writeData).toHaveBeenLastCalledWith({
            data: {
              githubAuth: {
                loadingToken: false,
                error,
                __typename: 'GithubAuth',
              },
            },
          });
        });
      });
    });
  });

  describe('when apollo data contains github auth token', () => {
    const data = {
      githubAuth: {
        token: '1234',
        loadingToken: false,
        error: null,
      },
    };
    const component = shallow(<Setup {...defaultProps} data={data} />);

    it('renders a <GetStartedContainer/> component', () => {
      expect(component.find(GetStartedContainer).length).toBe(1);
    });

    it('does not render a <SignInForm/> component', () => {
      expect(component.find(SignInForm).length).toBe(0);
    });
  });
});
