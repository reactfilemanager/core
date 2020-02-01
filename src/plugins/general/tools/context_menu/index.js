import React from 'react';
import icons from '../../../../assets/icons';
import InfoPanel from '../../Components/InfoPanel';
import {injectModal, injectSidePanel} from '../../state/actions';
import Permission from '../../Components/Permission';

export default {
  change_permission: {
    shouldShow(item) {
      return true;
    },
    menu_item: {
      icon: null,
      title: 'Change Permission',
    },
    handle(item, state, dispatch) {
      const modal = (props) => {
        return <Permission item={item} {...props}/>;
      };

      dispatch(injectModal(modal));
    },
  },
  details: {
    shouldShow(item) {
      return true; //can download everything
    },
    menu_item: {
      icon: icons.info,
      title: 'Details',
    },
    handle(item, state, dispatch) {
      const panel = (props) => {
        return <InfoPanel item={item} {...props}/>;
      };

      dispatch(injectSidePanel('info', panel));
    },
  },
  download: {
    shouldShow(item) {
      return !item.is_dir; //can download everything except for folders
    },
    menu_item: {
      icon: icons.download,
      title: 'Download',
    },
    handle(item) {
      window.open(download(item.path));
    },
  },
};