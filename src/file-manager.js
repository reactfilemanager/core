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
import Core, {CORE_PLUGIN_KEY} from './core/plugin';
import ImagePreview from './plugins/image_preview/Components/ImagePreview';

// core
const core = Pluggable.registerPlugin(CORE_PLUGIN_KEY, Core);

// image preview
core.inject(ImagePreview);

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
