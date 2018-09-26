import React from 'react';
import { shallow } from 'enzyme';
import { SetupNew } from './';

import SignInForm from '../../components/SignInForm';

describe('Setup', () => {
  const defaultProps = {
    data: {},
    client: {},
  };

  it('renders successfully', () => {
    const component = shallow(<SetupNew {...defaultProps} />);
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
      component = shallow(<SetupNew data={data} client={clientMock} />);
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
});
