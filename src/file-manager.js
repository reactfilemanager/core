require('./helpers/Prototypes');
import React from 'react';
import {render} from 'react-dom';
import App from './App';
import General from './plugins/general';
import {setBaseUrl} from './services/HttpService';
import {registerPlugin} from './pluggable';

registerPlugin(General);

export default function(element, config = {}) {
  setBaseUrl(config.url);
  render(<App/>, element);
}
