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

  handleModalSelection = (details) => {
    if (!details) return;
    const modal = window?.parent?.Joomla.Modal?.getCurrent();
    if (!modal) return;

    window.parent.Joomla.selectedMediaFile = details;
    Joomla.selectedMediaFile = details;

    let selectButton = modal.querySelector('.btn.btn-secondary.button-save-selected') ??
                       modal.querySelector('.button.button-success.btn.btn-success') ??
                       modal.querySelector('.btn.btn-success.button-save-selected') ??
                       modal.querySelector('.button-save-selected');
    if (selectButton) {
      selectButton.click();
    }
  }

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

    let details;
    if(Joomla.selectedMediaFile || window.parent.Joomla.selectedMediaFile){
      details = JSON.parse(JSON.stringify(Joomla.selectedMediaFile || window.parent.Joomla.selectedMediaFile || {}));
    }

    try{
      handlers.handle(item);
    }catch (e) {
      this.handleModalSelection(details);
      console.log(e);
    }
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
