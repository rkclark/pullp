import React from 'react';
import { shallow } from 'enzyme';
import { Route } from 'react-router-dom';

import { MainRouter } from '.';
import NavContainer from '../Nav';
import HomeNewContainer from '../../routes/HomeNew';
import Account from '../../routes/Account';
import SelectReposNewContainer from '../../routes/SelectReposNew';
import SetupNewContainer from '../../routes/SetupNew';
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

  it('renders a <NavContainer/> with correct path', () => {
    const navContainer = component.find(NavContainer);
    expect(navContainer.length).toBe(1);
    expect(navContainer.props().currentPath).toBe(
      defaultProps.location.pathname,
    );
  });

  const routes = [
    { path: '/app', component: HomeNewContainer },
    { path: '/app/account', component: Account },
    { path: '/app/selectRepos', component: SelectReposNewContainer },
    { path: '/app/setup', component: SetupNewContainer },
  ];

  routes.forEach(route => {
    it(`renders a <Route /> for ${route.path}`, () => {
      const routeWrapper = component.find({ path: route.path });
      expect(routeWrapper.type()).toBe(Route);
      expect(routeWrapper.props().component).toBe(route.component);
    });
  });

  describe('when loading is true', () => {
    it('renders a <LoadingMessage />', () => {
      const loadingComponent = shallow(
        <MainRouter {...defaultProps} data={{ loading: true }} />,
      );

      expect(loadingComponent.find(LoadingMessage).length).toBe(1);
    });
  });

  describe('when loading is false', () => {
    it('does not render a <LoadingMessage />', () => {
      expect(component.find(LoadingMessage).length).toBe(0);
    });
  });
});
