import FileManager from './App';

require('./helpers/Prototypes');
import React from 'react';
import {
  setBaseUrl,
  setHeaders,
  setPostData,
  setQueryParams,
} from './services/HttpService';
import {Pluggable} from './pluggable';

const setConfig = (config = {}) => {
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
};

export {
  Pluggable,
  setConfig,
};

export default FileManager;
