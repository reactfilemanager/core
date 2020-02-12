import FileManager from './src/file-manager';
import {Pluggable} from './src/pluggable';
import icons from './src/assets/icons';
import {toast} from 'react-toastify';
import {getSelectedItems} from './src/plugins/general/models/FileInfo';

const element = document.querySelector('#file-manager');

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
      return !item.is_dir && getSelectedItems(state.entries).length > 0;
    },
    (item, state, dispatch) => {
      console.log(item, state);
    },
);

FileManager(element, {
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
