import icons from '../../assets/icons';
import AudioPlayer from './VideoPlayer';
import React from 'react';
import {FILE_TYPES} from '../../core/Components/Toolbar/FilterByType';

let _fn = () => null;

export const pathResolver = {
  resolve(item) {
    return _fn(item);
  },
};

export const injection = {
  handlers: {
    video_player: {
      handles(item) {
        return FILE_TYPES.video.indexOf(item.extension) > -1;
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
