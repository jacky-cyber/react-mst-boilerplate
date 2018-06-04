import { types, flow, getParent } from 'mobx-state-tree';
import { reaction } from 'mobx';
import Cookies from 'universal-cookie';

import roles from '../../constants/roles';

const COOKIE_NAME = 'Authorization';

const SessionStore = types
  .model('SessionStore', {
    token: types.optional(types.string, ''),
    rememberMe: false,
  })
  .volatile(() => ({
    urlRoot: '/auth',
    cookies: new Cookies(),
  }))
  .views(self => ({
    get isLogged() {
      return self.token !== '' && self.token.length > 5;
    },

    get userFromTokenHeader() {
      const tokenContent = self.isLogged ? self.decodeJWTHeader(self.token) : null;
      return tokenContent ? tokenContent.user : null;
    },

    get transport() {
      return getParent(self).transport;
    },

    get currentUserRole() {
      return self.currentUser ? self.currentUser.role : roles.ROLE_GUEST;
    },
  }))
  .actions((self) => {
    /**
     * Decode JWT token header and return decoded content
     */
    const decodeJWTHeader = () => {
      const base64Url = self.token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse(window.atob(base64) || '{}');
    };

    /**
     * Do login with user credentials
     * If login succeed, save token from to use later in subsequent requests
     * @param {String} email
     * @param {String} password
     * @param {Boolean} rememberMe
     */
    const login = flow(function* login(email, password, rememberMe) {
      self.rememberMe = rememberMe;
      try {
        const response = yield self.transport.post(`${self.urlRoot}/login`, {
          email,
          password,
        });
        const { token } = response.data;

        if (token.length && token.length) {
          self.token = token;
        }
      } catch (error) {
        console.error(error);
      }
    });

    /**
     * Do logout, clear token from store and cookie
     */
    const logout = () => {
      self.token = '';
    };

    /**
     * Load authorization token from cookie
     */
    const loadAuthCookie = () => {
      self.token = self.cookies.get(COOKIE_NAME);
    };

    const forgotPassword = flow(function* forgotPassword(values) {
      try {
        const { data } = yield self.transport.post(`${self.urlRoot}/forgot-password`, values);
        return data;
      } catch (error) {
        console.error(error);
        return null;
      }
    });

    const newPassword = flow(function* newPassword(recoveryToken, password) {
      try {
        const { data } = yield self.transport.create(
          `${self.urlRoot}/new-password?token=${recoveryToken}`,
          { password },
        );
        return data;
      } catch (error) {
        console.error(error);
        return null;
      }
    });

    const checkRecoveryToken = flow(function* checkRecoveryToken(recoveryToken) {
      try {
        const { data } = yield self.transport.get(
          `${self.urlRoot}/forgot-token?token=${recoveryToken}`,
        );
        return data;
      } catch (error) {
        console.error(error);
        return null;
      }
    });

    const signup = flow(function* signup(values) {
      try {
        const { data } = yield self.transport.post(`${self.urlRoot}/signup`, values);
        return data;
      } catch (error) {
        console.error(error);
        return null;
      }
    });

    const setToken = (token) => {
      self.token = token;
    };

    /**
     * MobX State Tree model hook
     * This function will be called after this store is init
     * It will load and use token from cookie
     * This function will also observe token changed to set or remove cookie
     */
    const afterCreate = () => {
      self.loadAuthCookie();

      reaction(
        () => self.token,
        (token) => {
          if (!token) {
            self.cookies.remove(COOKIE_NAME, {
              path: '/',
            });
          } else {
            self.cookies.set(
              COOKIE_NAME,
              token,
              self.rememberMe
                ? {
                  path: '/',
                  maxAge: 24 * 3600 * 30,
                }
                : {
                  expires: 0,
                },
            );
          }
        },
      );
    };

    return {
      afterCreate,
      checkRecoveryToken,
      decodeJWTHeader,
      forgotPassword,
      loadAuthCookie,
      login,
      logout,
      newPassword,
      setToken,
      signup,
    };
  });

export default SessionStore;
