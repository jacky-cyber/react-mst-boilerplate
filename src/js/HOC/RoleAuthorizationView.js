import React, { Component } from 'react';
import PropTypes from 'prop-types';

import roles from '../constants/roles';

/**
 * Higher-order component to handle logic switch view between Kol and Organizer
 * Should use with `withRole` HOC to inject user role to props
 * Return not found page if un-authorized
 * @param {React Component} UserView component that will be rendered if user is a normal user
 * @param {React Component} AdminView component that will be rendered if user is an admin
 * @param {React Component} GuestView component that will be rendered
 * if user is not logged in (guest)
 */
const RoleAuthorizationView = (UserView, AdminView, GuestView) =>
  class RoleBasedComponent extends Component {
    static propTypes = {
      role: PropTypes.string.isRequired,
    };

    render() {
      const { role } = this.props;

      if (role === roles.ROLE_USER) return <UserView {...this.props} />;
      if (role === roles.ROLE_ADMIN) return <AdminView {...this.props} />;
      if (role === roles.ROLE_GUEST) return <GuestView {...this.props} />;

      return null;
    }
  };

export default RoleAuthorizationView;
