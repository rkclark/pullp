// import React from 'react';
// import { shallow } from 'enzyme';
// import SignInForm from '.';
// import * as githubAuth from '../../routes/Setup/helpers/githubAuth';
// import Button from '../Button';
// import LoadingMessage from '../LoadingMessage';
// import Error from '../Error';

// const authMock = jest.fn();
// githubAuth.default = authMock;

// describe('SignInForm', () => {
//   const defaultProps = {
//     saveGithubToken: () => {},
//     setLoadingToken: () => {},
//     saveTokenError: () => {},
//   };

//   let component;

//   describe('when loadingToken is false', () => {
//     beforeEach(() => {
//       component = shallow(
//         <SignInForm {...defaultProps} loadingToken={false} />,
//       );
//     });
//     it('renders github sign in button', () => {
//       const button = component.find(Button).at(0);
//       expect(button.props().children).toBe('Sign in with Github');
//     });

//     describe('when sign in button is clicked', () => {
//       it('calls githubAuth function with correct args', () => {
//         expect(authMock).not.toHaveBeenCalled();
//         component
//           .find(Button)
//           .at(0)
//           .simulate('click');
//         expect(authMock).toHaveBeenCalledWith(
//           defaultProps.saveGithubToken,
//           defaultProps.setLoadingToken,
//           defaultProps.saveTokenError,
//         );
//       });
//     });
//   });

//   describe('when loadingToken is true', () => {
//     beforeEach(() => {
//       component = shallow(<SignInForm {...defaultProps} loadingToken />);
//     });
//     it('renders a <LoadingMessage /> with correct message', () => {
//       const loadingMessage = component.find(LoadingMessage);
//       expect(loadingMessage.length).toBe(1);
//       expect(loadingMessage.props().message).toBe(
//         'Authenticating with Github...',
//       );
//     });

//     it('does not render github sign in button', () => {
//       const button = component.find(Button);
//       expect(button.length).toBe(0);
//     });
//   });

//   describe('when error is truthy', () => {
//     beforeEach(() => {
//       component = shallow(<SignInForm {...defaultProps} error={'borked'} />);
//     });
//     it('renders a <Error /> with correct message', () => {
//       const error = component.find(Error);
//       expect(error.length).toBe(1);
//       expect(error.props().title).toBe('Github Sign In Failed');
//       expect(error.props().message).toBe('Please try again.');
//     });

//     it('renders github sign in button', () => {
//       const button = component.find(Button).at(0);
//       expect(button.props().children).toBe('Sign in with Github');
//     });
//   });
// });
