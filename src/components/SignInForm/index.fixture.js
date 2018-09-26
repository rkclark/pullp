import SignInForm from '.';

const baseProps = {
  saveGithubToken: () => {},
  setLoadingToken: () => {},
  loadingToken: false,
};

export default [
  {
    component: SignInForm,
    name: 'Not loading the token',
    props: {
      ...baseProps,
    },
  },
  {
    component: SignInForm,
    name: 'Loading the token',
    props: {
      ...baseProps,
      loadingToken: true,
    },
  },
];
