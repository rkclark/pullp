import LoadingMessage from '.';

const baseProps = {
  message: 'I am a LoadingMessage',
};

export default [
  {
    component: LoadingMessage,
    name: 'Example',
    props: {
      ...baseProps,
    },
  },
];
