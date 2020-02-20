import {EventBus} from '../../helpers/Utils';
import React from 'react';
import ProgressiveJpeg from './ProgressiveJpeg';

export const PJPEG = 'pjpeg';

const config = {_api: null};

export const makeProgressive = (filepath) => {
  return new Promise((resolve, reject) => {
    if (!config._api) {
      reject('API not defined');
    }

    EventBus.$emit('GET_CURRENT_DIR', path => {
      config._api.convert(path, filepath)
        .then(response => {
          EventBus.$emit('UPDATE', {
            ...this.props.item,
            extra: {
              ...this.props.item.extra,
              pjpeg: true,
            },
          });
          resolve(response);
        })
        .catch(reject);
    });
  });
};

export const injection = {
  context_menu: {
    pjpeg: {
      shouldShow(item) {
        return item.is_file && item.extra && item.extra.pjpeg === false;
      },
      menu_item: {
        icon: '',
        title: 'Make Progressive',
      },
      handle(item) {
        makeProgressive(item.path);
      },
    },
  },
};

EventBus.$on('INFO_PANEL_SHOWN', e => {
  if (e.is_file && e.extra && e.extra.pjpeg === false) {
    EventBus.$emit('ADD_INFO_BLOCK', (props) => {
      return <ProgressiveJpeg {...props}/>;
    });
  }
});

export default {
  accessor() {
    return {};
  },
  api: {
    convert(path, filepath) {
      return {
        action: 'convert',
        path,
        filepath,
      };
    },
  },
  boot({api}) {
    config._api = api;
  },
};
