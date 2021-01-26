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
import {EventBus} from '@reactfilemanager/core/src/helpers/Utils';
import Core, {CORE_PLUGIN_KEY} from './core/plugin';
import ImagePreview from './plugins/image_preview';
import AudioPlayer, {injection as AudioPlayerInjection} from './plugins/audio_player';
import VideoPlayer, {injection as VideoPlayerInjection} from './plugins/video_player';
import PJpeg, {PJPEG, injection as PJpegInjection} from './plugins/progressive_jpeg';
import {toast} from 'react-toastify';
import icons from './assets/icons';
import {setWorkingPath} from './core/state/actions';
let _config = {};

// core
const core = Pluggable.registerPlugin(CORE_PLUGIN_KEY, Core);

// image preview
core.inject(ImagePreview);

// progressive jpeg
Pluggable.registerPlugin(PJPEG, PJpeg);
core.inject(PJpegInjection);

const setConfig = (config = {}) => {
  _config = config;
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
  
  if (config.path) {
    setWorkingPath(config.path);
  }
  
};

function registerAudioPlayer(core, ROOT_URL) {
  let audio_player = Pluggable.plugin('audio_player');
  if (!audio_player) {
    // register audio player
    audio_player = Pluggable.registerPlugin('audio_player', AudioPlayer);

    // inject audio player into core
    core.inject(AudioPlayerInjection);
  }
  // set audio path resolver
  audio_player.accessor().setPathResolver(item => {
    return ROOT_URL + item.path;
  });
}

function registerVideoPlayer(core, ROOT_URL) {
  let video_player = Pluggable.plugin('video_player');
  if (!video_player) {
    // register audio player
    video_player = Pluggable.registerPlugin('video_player', VideoPlayer);

    // inject audio player into core
    core.inject(VideoPlayerInjection);
  }
  // set audio path resolver
  video_player.accessor().setPathResolver(item => {
    return ROOT_URL + item.path;
  });
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

const getFileManagerConfig = (key = null) => {
  if (!key) {
    return _config;
  }

  if (_config[key] !== undefined) {
    return _config[key];
  }

  return null;
};

export {
  Pluggable,
  EventBus,
  setConfig,
  getFileManagerConfig,
  setWorkingPath
};

export default FileManager;
