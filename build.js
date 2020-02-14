import React from 'react';
import {render} from 'react-dom';
import FileManager, {setConfig, Pluggable} from './src/file-manager';
import icons from './src/assets/icons';
import {toast} from 'react-toastify';
import Core, {CORE_PLUGIN_KEY} from './src/core/plugin';
import ImagePreview from './src/plugins/image_preview/Components/ImagePreview';
import AudioPlayer, {injection as AudioPlayerInjection} from './src/plugins/audio_player';

const ROOT_URL = 'http://127.0.0.1:8000/tmp/storage';
const core = Pluggable.plugin(CORE_PLUGIN_KEY);

// register audio player
const audio_player = Pluggable.registerPlugin('audio_player', AudioPlayer);
// set audio path resolver
audio_player.accessor().setPathResolver(item => {
  return ROOT_URL + item.path;
});

// inject audio player into core
core.inject(AudioPlayerInjection);

// Copy URL context menu
core.addContextMenu(
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
