import React from 'react';
import icons from '../../../../assets/icons';
import InfoPanel from '../../Components/General/InfoPanel';
import {injectModal, injectSidePanel} from '../../state/actions';
import Permission from '../../Components/ContextMenu/Permission';
import Rename from '../../Components/ContextMenu/Rename';
import Delete from '../../Components/Toolbar/Delete';
import FileInfo from '../../models/FileInfo';
import Upload from '../../Components/ContextMenu/Upload';
import RemoteUpload from '../../Components/ContextMenu/RemoteUpload';
import NewFolder from '../../Components/ContextMenu/NewFolder';

export default {
  rename: {
    shouldShow(item) {
      return item instanceof FileInfo;
    },
    menu_item: {
      icon: icons.rename,
      title: 'Rename',
    },
    handle(item, state, dispatch) {
      const modal = (props) => {
        return <Rename item={item} {...props}/>;
      };

      dispatch(injectModal(modal));
    },
  },
  change_permission: {
    shouldShow(item) {
      return item instanceof FileInfo;
    },
    menu_item: {
      icon: icons.unlock,
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
      return item instanceof FileInfo;
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
      return item instanceof FileInfo && !item.is_dir; //can download everything except for folders
    },
    menu_item: {
      icon: icons.download,
      title: 'Download',
    },
    handle(item) {
      window.open(download(item.path));
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
    handle(item, state, dispatch) {
      const modal = props => {
        return <Delete {...props}/>;
      };

      dispatch(injectModal(modal));
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
    handle(item, state, dispatch) {
      const modal = (props) => {
        return <NewFolder {...props}/>;
      };

      dispatch(injectModal(modal));
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
    handle(item, state, dispatch) {
      const modal = (props) => {
        return <Upload {...props}/>;
      };

      dispatch(injectModal(modal));
    },
  },
  remote_download: {
    shouldShow(item) {
      return !!item.isCurrentDir;
    },
    menu_item: {
      icon: icons.cloud_upload,
      title: 'Upload Remote File',
    },
    handle(item, state, dispatch) {
      const modal = (props) => {
        return <RemoteUpload {...props}/>;
      };

      dispatch(injectModal(modal));
    },
  },
};