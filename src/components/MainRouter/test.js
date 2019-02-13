import React from 'react';
import { shallow } from 'enzyme';
import { Route, Switch } from 'react-router-dom';

import { MainRouter } from '.';
import Nav from '../Nav';
import HomeContainer from '../../routes/Home';
import AccountContainer from '../../routes/Account';
import SelectReposContainer from '../../routes/SelectRepos';
import SetupContainer from '../../routes/Setup';
import LoadingMessage from '../LoadingMessage';

describe('<MainRouter/>', () => {
  let component;
  const defaultProps = {
    data: {
      loading: false,
    },
    location: {
      pathname: '/test',
    },
  };

  beforeAll(() => {
    component = shallow(<MainRouter {...defaultProps} />);
  });

  it('renders a <Nav/> with correct path', () => {
    const navContainer = component.find(Nav);
    expect(navContainer.length).toBe(1);
    expect(navContainer.props().currentPath).toBe(
      defaultProps.location.pathname,
    );
  });

  const routes = [
    { path: '/app', component: HomeContainer },
    { path: '/app/account', component: AccountContainer },
    { path: '/app/selectRepos', component: SelectReposContainer },
    { path: '/app/setup', component: SetupContainer },
  ];

  routes.forEach(route => {
    it(`renders a <Route /> for ${route.path} within a <Switch/>`, () => {
      const switchWrapper = component.find(Switch);
      const routeWrapper = switchWrapper.find({ path: route.path });
      expect(routeWrapper.type()).toBe(Route);
      expect(routeWrapper.props().component).toBe(route.component);
    });
  });

  it('renders a Redirect to /app as the fallback in the Switch ', () => {
    const switchWrapper = component.find(Switch);
    const redirect = switchWrapper.children().last();
    expect(redirect.props().to).toBe('/app');
  });

  describe('when loading is true', () => {
    it('renders a <LoadingMessage />', () => {
      const loadingComponent = shallow(
        <MainRouter {...defaultProps} data={{ loading: true }} />,
      );

      expect(loadingComponent.find(LoadingMessage).length).toBe(1);
    });

    it('does not render any <Route/>s', () => {
      const loadingComponent = shallow(
        <MainRouter {...defaultProps} data={{ loading: true }} />,
      );

      expect(loadingComponent.find(Route).length).toBe(0);
    });
  });

  describe('when loading is false', () => {
    it('does not render a <LoadingMessage />', () => {
      expect(component.find(LoadingMessage).length).toBe(0);
    });
  });
});
