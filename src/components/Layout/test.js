import React from 'react';
import { shallow } from 'enzyme';
import { Route, Redirect } from 'react-router-dom';
import Error from '../Error';
import SetupContainer from '../../routes/Setup';
import MainRouterContainer from '../MainRouter';

import { Layout } from './';

describe('<Layout />', () => {
  const defaultProps = {
    data: {},
    error: null,
    location: { pathname: 'test' },
  };

  it('renders successfully', () => {
    const component = shallow(<Layout {...defaultProps} />);
    expect(component.length).toBe(1);
  });

  describe('when data contains Github auth token', () => {
    it('renders a <MainRouterContainer /> and passes through the location object', () => {
      const component = shallow(
        <Layout {...defaultProps} data={{ githubAuth: { token: '1234' } }} />,
      );

      const mainRouterContainer = component.find(MainRouterContainer);
      expect(mainRouterContainer.length).toBe(1);
      expect(mainRouterContainer.props().location).toBe(defaultProps.location);
    });
  });

  describe('when data does not contain a Github auth token', () => {
    it('renders a <Route /> for "/app/setup" with SetupContainer component', () => {
      const component = shallow(
        <Layout {...defaultProps} data={{ githubAuth: { token: null } }} />,
      );

      const route = component.find(Route);
      expect(route.length).toBe(1);
      expect(route.props().path).toBe('/app/setup');
      expect(route.props().component).toBe(SetupContainer);
    });

    describe('when current pathnam eis not "/app/setup"', () => {
      it('renders a <Redirect /> to "/app/setup"', () => {
        const component = shallow(
          <Layout
            {...defaultProps}
            data={{ githubAuth: { token: null } }}
            location={{ pathname: '/' }}
          />,
        );

        const redirect = component.find(Redirect);
        expect(redirect.length).toBe(1);
        expect(redirect.props().to).toBe('/app/setup');
      });
    });
  });

  describe('when error is provided', () => {
    it('renders a <Error />', () => {
      const component = shallow(
        <Layout {...defaultProps} error={{ borked: true }} />,
      );

      expect(component.find(Error).length).toBe(1);
    });
  });
});
