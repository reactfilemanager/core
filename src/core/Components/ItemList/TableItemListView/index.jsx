import React from 'react';
import {ContextMenuTrigger} from 'react-contextmenu';
import {CONTEXT_MENU_ID} from '../../ContextMenu';
import ListViewBase from '../ListViewBase';

class TableItemListView extends ListViewBase {

  toggleCheck = item => e => {
    e.preventDefault();
    e.stopPropagation();

    this.toggleSelect(true, false);
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
          <td colSpan={6}>Empty</td>
        </tr>
      }
      </tbody>
    );
  }

  getRow = item => {
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
          <label>
            <input type="checkbox" checked={item.selected} onChange={e => e}/>
          </label>
        </td>
        <td>
          <img src={this.thumb(item)}/>
        </td>
        <td> {
          item.is_dir ?
            <p>{item.name}</p>
            : item.name
        }
        </td>
        <td>
          {item.is_file ? item.size.toHumanFileSize() : ''}
        </td>
        <td>
          {item.perms}
        </td>
        <td>
          {item.last_modified.toHumanFormat()}
        </td>
        <td/>
      </ContextMenuTrigger>
    );
  };
}

export default TableItemListView;
