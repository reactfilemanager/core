import React from 'react';
import {setWorkingPath, toggleSelect} from '../../state/actions';
import {getDefaultHandler} from '../../tools/config';
import {toast} from 'react-toastify';
import {image_folder} from '../../../assets/images';

export default class ListViewBase extends React.Component {

  moveTo = (item) => {
    if (item.is_dir) {
      const path = item.path.replace(/\/$/, '');
      this.props.moveTo(path);
      setWorkingPath(path);
    }
  };

  handleDoubleClick = item => e => {
    e.preventDefault();
    e.stopPropagation();

    if (item.is_dir) {
      return this.moveTo(item);
    }

    const handlers = getDefaultHandler(item);
    if (!handlers) {
      toast.info('Unsupported file type.');
      return;
    }
    handlers.handle(item);
  };

  toggleSelect = (item, ctrlKey, shiftKey) => {
    toggleSelect(ctrlKey, shiftKey, item.id);
  };

  handleClick = item => e => {
    e.preventDefault();
    e.stopPropagation();
    this.toggleSelect(item, e.ctrlKey || e.metaKey, e.shiftKey);
  };

  handleContextMenu = item => e => {
    if (this.props.selectedItems.indexOf(item.id) < 0 || this.props.selectedItems.length < 2) {
      this.handleClick(e);
    }
  };

  collect = item => () => {
    return {
      item: item,
    };
  };

  title(item) {
    const parts = [
      item.name,
      item.size.toHumanFileSize(),
      item.perms,
    ];

    return parts.join('\n');
  }

  getAttributes = (item, withHandlers = false) => {
    let attrs = {
      onContextMenu: this.handleContextMenu(item),
      className: this.props.selectedItems.indexOf(item.id) >= 0 ? 'selected' : '',
    };

    if (withHandlers) {
      attrs = {
        ...attrs,
        onDoubleClick: this.handleDoubleClick(item),
        onClick: this.handleClick(item),
      };
    }

    return attrs;
  };

  className(item) {
    const className = ['fm-item'];
    if (this.props.selectedItems.indexOf(item.id) >= 0) {
      className.push('fm-item-selected');
    }
    return className.join(' ');
  }

  thumb(item) {
    if (item.is_dir) {
      return image_folder;
    }

    return thumb(item.path);
  };
}
