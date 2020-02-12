import React from 'react';
import {render} from 'react-dom';
import FileManager, {setConfig, Pluggable} from './src/file-manager';
import icons from './src/assets/icons';
import {toast} from 'react-toastify';

const ROOT_URL = 'https://file-manager-server.m3r.dev/tmp/storage';

const generalPlugin = Pluggable.plugin('general');
generalPlugin.addContextMenu(
    'copy_url',
    (item, state) => {
      return item.is_file;
    },
    (item, state, dispatch) => {
      `${ROOT_URL}${item.path}`.copyToClipboard();
      toast.info('URL Copied!');
    },
    {
      icon: icons.link,
      title: 'Copy URL',
    },
);

generalPlugin.addHandler(
    'default',
    (item, state) => {
      return !item.is_dir && generalPlugin.accessor().getSelectedItems().length > 0;
    },
    (item, state, dispatch) => {
      console.log(item, state);
    },
);

setConfig({
  // URL of the server installation
  url: 'http://127.0.0.1:8000/',
  // HTTP request modifiers
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

const element = document.querySelector('#file-manager');

render(<FileManager/>, element);
