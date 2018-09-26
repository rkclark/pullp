import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';
import { GetStarted } from '.';
import LoadingMessage from '../LoadingMessage';
import Error from '../Error';
import Button from '../Button';

describe('<GetStarted/>', () => {
  const defaultProps = {
    data: {
      viewer: {
        login: 'test',
        avatarUrl: '/avatar/url',
      },
    },
    loading: false,
    error: null,
    refetch: () => {},
    networkStatus: 1,
  };

  it('renders successfully', () => {
    const component = shallow(<GetStarted {...defaultProps} />);
    expect(component.length).toBe(1);
  });

  describe('when loading is true', () => {
    it('renders a <LoadingMessage/> with correct message', () => {
      const component = shallow(<GetStarted {...defaultProps} loading />);
      const loadingMessage = component.find(LoadingMessage);
      expect(loadingMessage.length).toBe(1);
      expect(loadingMessage.props().message).toBe(
        'Loading your Github profile...',
      );
    });
  });

  describe('when network status === 4 (refetching)', () => {
    it('renders a <LoadingMessage/> with correct message', () => {
      const component = shallow(
        <GetStarted {...defaultProps} networkStatus={4} />,
      );
      const loadingMessage = component.find(LoadingMessage);
      expect(loadingMessage.length).toBe(1);
      expect(loadingMessage.props().message).toBe(
        'Loading your Github profile...',
      );
    });
  });

  describe('when error is truthy', () => {
    let component;
    const refetchMock = jest.fn();

    beforeAll(() => {
      component = shallow(
        <GetStarted
          {...defaultProps}
          error={{ borked: true }}
          refetch={refetchMock}
        />,
      );
    });

    afterEach(() => {
      refetchMock.mockClear();
    });

    it('renders an <Error /> with the correct message', () => {
      const error = component.find(Error);
      expect(error.length).toBe(1);
      expect(error.props().message).toBe(
        'Failed to load your Github profile from the Github API. Please try again later.',
      );
    });

    it('renders a retry button', () => {
      const button = component.find(Button);
      expect(button.length).toBe(1);
      expect(button.props().children).toBe('Retry');
    });

    describe('retry button onClick', () => {
      it('calls the refetch function', () => {
        expect(refetchMock).not.toHaveBeenCalled();
        const button = component.find(Button);
        button.props().onClick();
        expect(refetchMock).toHaveBeenCalled();
      });
    });
  });

  describe('when data is received', () => {
    let component;

    beforeAll(() => {
      component = shallow(<GetStarted {...defaultProps} />);
    });

    it('renders an <Link /> to /app/selectRepos', () => {
      const link = component.find(Link);
      expect(link.length).toBe(1);
      expect(link.props().to).toBe('/app/selectRepos');
    });
  });
});
