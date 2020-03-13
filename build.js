import React from 'react';
import {render} from 'react-dom';
import FileManager, {Pluggable, setConfig} from './src/file-manager';

window.Pluggable = Pluggable;
// Selection handler on file select mode
Pluggable.plugin('core').addContextMenu(
  'test_pro',
  (item, state) => {
    return item.is_file;
  },
  (item, state, dispatch) => {
    alert('This is a pro feature');
    console.log(item, state);
  },
  {
    icon: '',
    title: <p>Test This as <strong style={{background: 'blue', color: '#fff'}}>PRO</strong></p>,
  },
);

setConfig({
  // URL of the server installation
  url: 'http://127.0.0.1:8000/',
  // HTTP request modifiers
  root_url: 'http://127.0.0.1:8000/tmp/storage',
  http: {
    query_params: {
      foo: 'bar',
    },
    post_data: {
      hello: 'world',
    },
    // headers: {
    //   'X-Token': 'API-Token',
    // },
  },
});

const element = document.querySelector('#rfm');

render(<FileManager />, element);
