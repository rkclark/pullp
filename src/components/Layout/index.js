import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, Link } from 'react-router-dom';
import HomeContainer from '../../routes/Home';
import Login from '../../routes/Login';
import SelectRepos from '../../routes/SelectRepos'; //eslint-disable-line
import defaultTheme from './theme.css';
import eye from '../../images/eye-white.svg';
import pin from '../../images/pin-white.svg';
import account from '../../images/account-white.svg';

export default function Layout({ theme }) {
  const path = window.location.pathname;
  return (
    <div className={theme.layout}>
      <div className={theme.header}>
        <h1 className={theme.title}>PULLP</h1>
        <div className={theme.linkContainer}>
          <Link
            to="/"
            className={`${theme.link} ${path === '/'
              ? theme.activeLink
              : null}`}
          >
            <img src={eye} alt="eye icon" className={theme.icon} />
          </Link>
        </div>
        <div className={theme.linkContainer}>
          <Link
            to="/selectRepos"
            className={`${theme.link} ${path === '/selectRepos'
              ? theme.activeLink
              : null}`}
          >
            <img src={pin} alt="pin icon" className={theme.icon} />
          </Link>
        </div>
        <div className={theme.linkContainer}>
          <Link
            to="/login"
            className={`${theme.link} ${path === '/login'
              ? theme.activeLink
              : null}`}
          >
            <img src={account} alt="account icon" className={theme.icon} />
          </Link>
        </div>
      </div>
      {window.location.pathname.includes('index.html') && <Redirect to="/" />}
      <div>
        <Route exact path="/" component={HomeContainer} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/selectRepos" component={SelectRepos} />
      </div>
    </div>
  );
}

Layout.propTypes = {
  theme: PropTypes.shape(),
};

Layout.defaultProps = {
  theme: defaultTheme,
};
