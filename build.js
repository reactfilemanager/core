import React from 'react';
import {render} from 'react-dom';
import FileManager, {setConfig} from './src/file-manager';

// Selection handler on file select mode
// generalPlugin.addHandler(
//     'default',
//     (item, state) => {
//       return !item.is_dir && generalPlugin.accessor().getSelectedItems().length > 0;
//     },
//     (item, state, dispatch) => {
//       console.log(item, state);
//     },
// );

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

render(<FileManager/>, element);
