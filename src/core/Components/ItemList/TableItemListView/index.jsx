import React from 'react';
import {ContextMenuTrigger} from 'react-contextmenu';
import {CONTEXT_MENU_ID} from '../../ContextMenu';
import ListViewBase from '../ListViewBase';
import {Checkbox} from 'theme-ui';

class TableItemListView extends ListViewBase {

  toggleCheck = item => e => {
    e.preventDefault();
    e.stopPropagation();

    this.toggleSelect(item, true, false);
  };

  render() {
    const {items} = this.props;
    const _items = [...items.dirs, ...items.files];

    return (
      <tbody>
      {_items.length
        ?
        _items.map(item => this.getRow(item))
        : <tr>
          <td colSpan={6}>
            <div className="fm-alert empty">
                <p>This folder is empty. Add some files or create folder.</p>
              </div>
          </td>
        </tr>
      }
      </tbody>
    );
  }

  getRow = item => {
    const checked = this.props.selectedItems.indexOf(item.id) > -1;

    return (
      <ContextMenuTrigger
        key={item.id}
        id={CONTEXT_MENU_ID}
        holdToDisplay={1000}
        name={item.name}
        collect={this.collect(item)}
        attributes={this.getAttributes(item, true)}
        renderTag="tr"
      >
        <td onClick={this.toggleCheck(item)}>
          <label className="checkbox" style={{pointerEvents: 'none'}}>
            {/*<input type="checkbox" checked={checked} readOnly/>*/}
            <Checkbox checked={checked} readOnly/>
          </label>
        </td>
        <td>
          <div className="d-flex">
          <img src={this.thumb(item)} width="20px"/>
          {
            <p className="file-name">{item.name}</p>
          }
          </div>
        </td>
        
        <td className="filesize">
          {item.is_file ? item.size.toHumanFileSize() : ''}
        </td>
        <td className="filepermission">
          {item.perms}
        </td>
        <td className="modified">
          {item.last_modified.toHumanFormat()}
        </td>
      </ContextMenuTrigger>
    );
  };
}

export default TableItemListView;
