/* Javascript generator function polyfill */
import 'regenerator-runtime/runtime';

import React, { Component } from 'react';
import { Router, browserHistory } from 'react-router';

import { hot } from 'react-hot-loader';
import _values from 'lodash/values';

import Loadable from 'react-loadable';
import withRole from './HOC/withRole';
import App from './containers/App';
import Header from './containers/Header';
import Sider from './containers/Sider';

import roles from './constants/roles';

const Loading = () => <div>Loading...</div>;

const AsyncHomePage = Loadable({
  loader: () => import(/* webpackChunkName: "HomePage" */ './pages/HomePage'),
  loading: Loading,
  delay: 300,
});

const AsyncLoginPage = Loadable({
  loader: () => import(/* webpackChunkName: "LoginPage" */ './pages/LoginPage'),
  loading: Loading,
  delay: 300,
});

const AsyncDashboardPage = Loadable({
  loader: () => import(/* webpackChunkName: "DashboardPage" */ './pages/DashboardPage'),
  loading: Loading,
  delay: 300,
});

// const User = withRole([roles.ROLE_USER]);
// const Admin = withRole([roles.ROLE_ADMIN]);
const Guest = withRole([roles.ROLE_GUEST]);
const Anyone = withRole(_values(roles));

const routes = {
  path: '/',
  component: App,
  indexRoute: {
    component: Guest(AsyncHomePage),
  },
  childRoutes: [
    {
      path: '',
      component: Anyone(Sider),
      childRoutes: [
        {
          path: '',
          component: Anyone(Header),
          childRoutes: [
            {
              path: 'dashboard',
              component: AsyncDashboardPage,
            },
          ],
        },
      ],
    },
    {
      path: 'login',
      component: AsyncLoginPage,
    },
  ],
};

class Routes extends Component {
  render() {
    return <Router history={browserHistory} routes={routes} />;
  }
}

export default hot(module)(Routes);
