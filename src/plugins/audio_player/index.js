import icons from '../../assets/icons';
import AudioPlayer from './AudioPlayer';
import React from 'react';
import {FILE_TYPES} from '../../core/Components/Toolbar/Search';
import {EventBus} from '../../helpers/Utils';

let _fn = () => null;

export const pathResolver = {
  resolve(item) {
    return _fn(item);
  },
};

export const injection = {
  handlers: {
    audio_player: {
      handles(item) {
        return FILE_TYPES.audio.indexOf(item.extension) > -1;
      },
      menu_item: {
        icon: icons.play,
        title: 'Play',
      },
      handle(item, state, dispatch) {
        const component = (props) => {
          return <AudioPlayer item={item} {...props}/>;
        };

        EventBus.$emit('INJECT_COMPONENT', component);
      },
      type: 'preview',
    },
  },
};

export default {
  accessor() {
    return {
      setPathResolver(fn) {
        _fn = fn;
      },
    };
  },
};
