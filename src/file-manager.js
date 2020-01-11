import React from 'react';
import {render} from 'react-dom';
import App from './App';

export default function(element, config = {}) {
  render(<App/>, element);
}
