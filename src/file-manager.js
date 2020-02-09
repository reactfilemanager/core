require('./helpers/Prototypes');
import React from 'react';
import {render} from 'react-dom';
import App from './App';
import General from './plugins/general';
import ImagePreview from './plugins/image_preview';
import {
  setBaseUrl,
  setHeaders,
  setPostData,
  setQueryParams,
} from './services/HttpService';
import {registerPlugin} from './pluggable';

registerPlugin(General);
registerPlugin(ImagePreview);

const mount = (element, config = {}) => {
  setBaseUrl(config.url);
  if (config.http) {
    if (config.http.headers) {
      setHeaders(config.http.headers);
    }
    if (config.http.query_params) {
      setQueryParams(config.http.query_params);
    }
    if (config.http.post_data) {
      setPostData(config.http.post_data);
    }
  }



  render(<App/>, element);
};

export {
  registerPlugin,
  mount,
};

export default mount;
