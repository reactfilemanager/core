import React from 'react';
import icons from '../../../assets/icons';
import InfoPanel from '../../Components/InfoPanel';
import {injectModal, injectSidePanel} from '../../state/actions';
import Rename from '../../Components/Utilities/Rename';
import Delete from '../../Components/Utilities/Delete';
import FileInfo from '../../models/FileInfo';
import Upload from '../../Components/Utilities/Upload';
import NewFolder from '../../Components/Utilities/NewFolder';

export default {
  rename: {
    shouldShow(item) {
      return item instanceof FileInfo;
    },
    menu_item: {
      icon: icons.rename,
      title: 'Rename',
    },
    handle(item) {
      const modal = (props) => {
        return <Rename item={item} {...props}/>;
      };

      injectModal(modal);
    },
  },
  details: {
    shouldShow(item) {
      return item instanceof FileInfo;
    },
    menu_item: {
      icon: icons.info,
      title: 'Details',
    },
    handle(item) {
      const panel = (props) => {
        return <InfoPanel item={item} {...props}/>;
      };

      injectSidePanel('info', panel);
    },
  },
  download: {
    shouldShow(item) {
      return item instanceof FileInfo && !item.is_dir; //can download
                                                       // everything except for
                                                       // folders
    },
    menu_item: {
      icon: icons.download,
      title: 'Download',
    },
    handle(item) {
      let iframe = document.getElementById('downloader_iframe');
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'downloader_iframe';
        document.body.append(iframe);
      }
      iframe.src = download(item.path);
    },
  },
  trash: {
    shouldShow(item) {
      return item instanceof FileInfo;
    },
    menu_item: {
      icon: icons.trash,
      title: 'Delete',
    },
    handle(item) {
      const modal = props => {
        return <Delete {...props}/>;
      };

      injectModal(modal);
    },
  },
  new_file: {
    shouldShow(item) {
      return false;//!!item.isCurrentDir;
    },
    menu_item: {
      icon: icons.file_add,
      title: 'New File',
    },
    handle(item, state, dispatch) {
      console.log(item, state, dispatch);
    },
  },
  new_folder: {
    shouldShow(item) {
      return !!item.isCurrentDir;
    },
    menu_item: {
      icon: icons.folder_add,
      title: 'New Folder',
    },
    handle(item) {
      const modal = (props) => {
        return <NewFolder {...props}/>;
      };

      injectModal(modal);
    },
  },
  upload: {
    shouldShow(item) {
      return !!item.isCurrentDir;
    },
    menu_item: {
      icon: icons.cloud_upload,
      title: 'Upload Local File',
    },
    handle(item) {
      const modal = (props) => {
        return <Upload {...props}/>;
      };

      injectModal(modal);
    },
  },
  // remote_download: {
  //   shouldShow(item) {
  //     return !!item.isCurrentDir;
  //   },
  //   menu_item: {
  //     icon: icons.cloud_upload,
  //     title: 'Upload From Url',
  //   },
  //   handle(item) {
  //     const modal = (props) => {
  //       return <RemoteUpload {...props}/>;
  //     };

  //     injectModal(modal);
  //   },
  // },
};
