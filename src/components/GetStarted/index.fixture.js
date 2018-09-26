import { GetStarted } from '.';

const baseProps = {
  saveGithubToken: () => {},
  setLoadingToken: () => {},
  loadingToken: false,
};

export default [
  {
    component: GetStarted,
    name: 'Not loading the token',
    props: {
      ...baseProps,
    },
  },
  {
    component: GetStarted,
    name: 'Loading the token',
    props: {
      ...baseProps,
      loadingToken: true,
    },
  },
  {
    component: GetStarted,
    name: 'With error',
    props: {
      ...baseProps,
      error: 'Borked',
    },
  },
];
