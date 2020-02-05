import ImagePreview from './Components/ImagePreview';
import React from 'react';

export default {
  image_preview: {
    injects: {
      general: {
        handlers: {
          image_preview: {
            handles(item) {
              return ['jpg', 'jpeg', 'bmp', 'svg', 'ico', 'gif', 'webp', 'png'].indexOf(item.extension) > -1;
            },
            menu_item: {
              icon: '',
              title: 'Preview',
            },
            handle(item, state, dispatch) {
              const component = (props) => {
                return <ImagePreview item={item} {...props}/>;
              };

              dispatch({type: 'INJECT_COMPONENT', payload: component});
            },
            type: 'preview',
          },
        },
      },
    },

  },
};
