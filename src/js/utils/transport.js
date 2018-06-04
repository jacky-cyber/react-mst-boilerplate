import axios from 'axios';

class RestTransport {
  client = null;

  constructor(config = {}) {
    this.client = axios.create(
      config || {
        baseURL: config.baseURL,
        timeout: 100000,
      },
    );

    this.client.interceptors.request.use((currentConfig) => {
      const newConfig = Object.assign({}, currentConfig);
      if (newConfig.token) {
        newConfig.headers.Authorization = `Bearer ${newConfig.token}`;
      }
      if (newConfig.language) {
        newConfig.headers['Accept-Language'] = newConfig.language;
      }
      return newConfig;
    });

    this.client.interceptors.response.use(
      response => response,
      (error) => {
        if (
          error.response &&
          error.response.status === 400 &&
          config.handleBadRequest &&
          config.handleBadRequest instanceof Function
        ) {
          config.handleBadRequest();
        }

        if (
          error.response &&
          error.response.status === 401 &&
          config.handleUnauthorized &&
          config.handleUnauthorized instanceof Function
        ) {
          config.handleUnauthorized();
        }

        return Promise.reject(error);
      },
    );
  }

  fetch(url, params = {}) {
    return this.client.get(url, { params });
  }

  create(url, data, config = {}) {
    return this.client.post(url, data, config);
  }

  post(url, data, config = {}) {
    return this.client.post(url, data, config);
  }

  get(url, params = {}) {
    return this.fetch(url, params);
  }

  update(url, data, config = {}) {
    return this.client.put(url, data, config);
  }

  delete(url) {
    return this.client.delete(url);
  }

  rootUrl() {
    return this.client.defaults.baseURL;
  }
}

export default RestTransport;
