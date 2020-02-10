import FileManager from './src/file-manager';
import {registerPlugin} from './src/pluggable';
import {getSelectedItems} from './src/plugins/general/models/FileInfo';
import icons from './src/assets/icons';
import {toast} from 'react-toastify';

const element = document.querySelector('#file-manager');

const ROOT_URL = 'https://file-manager-server.m3r.dev/tmp/storage';

registerPlugin({
  quix: {
    injects: {
      general: {
        // prefix URL of the files
        root_url: ROOT_URL,
        // selection handler
        handlers: {
          default: {
            // if context menu item should be shown/handle should be called
            handles(item, state) {
              return !item.is_dir && getSelectedItems(state.entries).length > 0;
            },
            // handle the item/items
            handle(item, state) {
              console.log(item, state);
            },
            order: 0,
          },
        },
        context_menu: {
          copy_url: {
            shouldShow(item) {
              return item.is_file;
            },
            menu_item: {
              icon: icons.link,
              title: 'Copy URL',
            },
            handle(item) {
              `${ROOT_URL}${item.path}`.copyToClipboard();
              toast.info('URL Copied!');
            },
          },
        },
      },
    },
  },
});

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
