import ImagePreview from './Components/ImagePreview';
import React from 'react';
import icons from '../../assets/icons';
import {EventBus} from '../../helpers/Utils';

export default {
  handlers: {
    image_preview: {
      handles(item) {
        return ['jpg', 'jpeg', 'bmp', 'svg', 'ico', 'gif', 'webp', 'png'].indexOf(item.extension) > -1;
      },
      menu_item: {
        icon: icons.preview,
        title: 'Preview',
      },
      handle(item) {
        const component = (props) => {
          return <ImagePreview item={item} {...props}/>;
        };

        EventBus.$emit('INJECT_COMPONENT', component);
      },
      type: 'preview',
    },
  },
};
