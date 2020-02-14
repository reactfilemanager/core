import FileManager from './App';

require('./helpers/Prototypes');
import React from 'react';
import {
  setBaseUrl,
  setHeaders,
  setPostData,
  setQueryParams,
} from './services/HttpService';
import {Pluggable} from './pluggable';
import Core, {CORE_PLUGIN_KEY} from './core/plugin';
import ImagePreview from './plugins/image_preview/Components/ImagePreview';
import AudioPlayer, {injection as AudioPlayerInjection} from './plugins/audio_player';
import {toast} from 'react-toastify';
import icons from './assets/icons';

// core
const core = Pluggable.registerPlugin(CORE_PLUGIN_KEY, Core);

// image preview
core.inject(ImagePreview);

const setConfig = (config = {}) => {
  setBaseUrl(config.url);
  if (config.root_url) {
    registerAudioPlayer(core, config.root_url);
    registerVideoPlayer(core, config.root_url);
    registerCopyURLMenuItem(core, config.root_url);
  }

  if (config.http) {
    if (config.http.headers) {
      setHeaders(config.http.headers);
    }
    if (config.http.query_params) {
      setQueryParams(config.http.query_params);
    }
    if (config.http.post_data) {
      setPostData(config.http.post_data);
    }
  }
};

function registerAudioPlayer(core, ROOT_URL) {
  // register audio player
  const audio_player = Pluggable.registerPlugin('audio_player', AudioPlayer);
  // set audio path resolver
  audio_player.accessor().setPathResolver(item => {
    return ROOT_URL + item.path;
  });

  // inject audio player into core
  core.inject(AudioPlayerInjection);
}

function registerVideoPlayer(core, ROOT_URL) {

}

function registerCopyURLMenuItem(core, ROOT_URL) {
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
}

export {
  Pluggable,
  setConfig,
};

export default FileManager;
