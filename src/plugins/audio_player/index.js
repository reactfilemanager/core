import icons from '../../assets/icons';
import AudioPlayer from './AudioPlayer';
import React from 'react';

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
        return ['mp3', 'ogg', 'm4a', 'aac', 'wav'].indexOf(item.extension) > -1;
      },
      menu_item: {
        icon: icons.play,
        title: 'Play',
      },
      handle(item, state, dispatch) {
        const component = (props) => {
          return <AudioPlayer item={item} {...props}/>;
        };

        dispatch({type: 'INJECT_COMPONENT', payload: component});
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
