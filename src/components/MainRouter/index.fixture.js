import { GetStarted } from '.';

const baseProps = {
  data: {
    viewer: {
      login: 'rkclark',
      avatarUrl: 'https://avatars2.githubusercontent.com/u/15447744?v=4',
    },
  },
  loading: false,
  error: null,
  refetch: () => {},
  networkStatus: 1,
};

export default [
  {
    component: GetStarted,
    name: 'With data',
    props: {
      ...baseProps,
    },
    url: '/',
  },
  {
    component: GetStarted,
    name: 'Loading',
    props: {
      ...baseProps,
      loading: true,
    },
    url: '/',
  },
  {
    component: GetStarted,
    name: 'Refetching',
    props: {
      ...baseProps,
      networkStatus: 4,
    },
    url: '/',
  },
  {
    component: GetStarted,
    name: 'With error',
    props: {
      ...baseProps,
      error: 'Borked',
    },
    url: '/',
  },
];
