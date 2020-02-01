require('./helpers/Prototypes');
import React from 'react';
import {render} from 'react-dom';
import App from './App';
import General from './plugins/general';
import ImagePreview from './plugins/image_preview';
import {setBaseUrl} from './services/HttpService';
import {registerPlugin} from './pluggable';

registerPlugin(General);
registerPlugin(ImagePreview);

const mount = (element, config = {}) => {
  setBaseUrl(config.url);
  render(<App/>, element);
};

export {
  registerPlugin,
  mount,
};

export default mount;
