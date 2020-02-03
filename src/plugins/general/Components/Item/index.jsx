/** @jsx jsx */
import {jsx, Card, Text, Image} from 'theme-ui';
import {Component} from 'react';
import {setEntries} from '../../state/actions';
import {ContextMenuTrigger} from 'react-contextmenu';
import {CONTEXT_MENU_ID} from '../ContextMenu';

class Item extends Component {

  moveTo = (item) => {
    if (item.is_dir) {
      const path = item.path.replace(/\/$/, '');
      this.props.moveTo(path);
    }
  };

  handleDoubleClick = e => {
    e.preventDefault();
    e.stopPropagation();

    if (this.props.item.is_dir) {
      return this.moveTo(this.props.item);
    }

    console.log('Use handler to handle this file', this.props.item);
  };

  handleClickName = e => {
    e.preventDefault();
    e.stopPropagation();

    if (this.props.item.is_dir) {
      this.moveTo(this.props.item);
    }
  };

  handleClick = e => {
    e.preventDefault();
    e.stopPropagation();

    let shouldMark = false;
    const lastSelectedItem = this.findLastSelected();
    if (e.shiftKey && lastSelectedItem) {
      const self = this;

      function mark(item) {
        let skip = false;
        if (!shouldMark && (item.path === lastSelectedItem.path || item.path === self.props.item.path)) {
          // marking start
          shouldMark = true;
          skip = true;
        }

        if (shouldMark) {
          item.selected = true;
          item.selection_time = new Date();
        }
        else {
          item.selected = false;
          item.selection_time = null;
        }

        if (!skip && shouldMark && (item.path === lastSelectedItem.path || item.path === self.props.item.path)) {
          // marking end
          shouldMark = false;
        }
        return item;
      }

      const dirs = this.props.state.entries.dirs.map(dir => mark(dir));
      const files = this.props.state.entries.files.map(file => mark(file));

      this.props.dispatch(setEntries({dirs, files}));
    }
    else {
      const dirs = this.props.state.entries.dirs.map(
          dir => this.markItemSelected(dir, e.ctrlKey || e.metaKey, e.shiftKey));
      const files = this.props.state.entries.files.map(
          file => this.markItemSelected(file, e.ctrlKey || e.metaKey, e.shiftKey));
      this.props.dispatch(setEntries({dirs, files}));
    }
  };

  getSelectedItems = () => {
    return [...this.props.state.entries.dirs, ...this.props.state.entries.files].filter(item => item.selected);
  };

  findLastSelected = () => {
    const items = this.getSelectedItems().sort((a, b) => a.selection_time < b.selection_time ? 1 : -1);
    if (items.length) {
      return items.shift();
    }
    return null;
  };

  markItemSelected = (item, ctrlKey) => {
    item.selection_time = null;
    if (!ctrlKey) {
      item.selected = false;
    }

    if (this.props.item.path === item.path) {
      item.selected = !item.selected;
      item.selection_time = new Date();
    }
    return item;
  };

  handleContextMenu = e => {
    if (this.getSelectedItems().length < 2) {
      this.handleClick(e);
    }
  };

  collect = () => {
    return {
      item: this.props.item,
    };
  };

  get title() {
    const item = this.props.item;
    const parts = [
      item.name,
      item.size.toHumanFileSize(),
      item.perms,
    ];

    return parts.join('\n');
  }

  getAttributes = (item) => {
    return {
      onDoubleClick: this.handleDoubleClick,
      onClick: this.handleClick,
      // onContextMenu: this.handleContextMenu,
      className: (item.selected ? ' selected' : ''),
    };
  };

  getGridItem = (item) => {
    return (
        <Card>
          <ContextMenuTrigger
              key={`${item.name}_${item.size}_${item.extension}`}
              id={CONTEXT_MENU_ID}
              holdToDisplay={1000}
              name={item.name}
              collect={this.collect}
              attributes={this.getAttributes(item)}
          >
            {item.is_dir
                ? null
                : <Image
                src={thumb(item.path)}
            />}
            <Text>
              {
                item.is_dir ?
                    <a href="#" onClick={this.handleClickName}>{item.name}</a>
                    : item.name
              }
              {item.components}
            </Text>
          </ContextMenuTrigger>
        </Card>
    );
  };

  getListItem = (item) => {
    return (
        <ContextMenuTrigger key={`${item.name}_${item.size}_${item.extension}`}
                            id={CONTEXT_MENU_ID}
                            holdToDisplay={1000}
                            name={item.name}
                            collect={this.collect}
                            attributes={this.getAttributes(item)}
                            renderTag="tr"
        >
          <td><input type="checkbox" checked={item.selected}/></td>
          <td>
            {
              item.is_dir
                  ? <a href="#" onClick={this.handleClickName}
                  >
                    {item.name}
                  </a>
                  : item.name
            }
          </td>
          <td>
            {item.is_dir ? 'Folder' : ''}
            {item.is_link ? 'Symlink' : ''}
            {item.is_file ? 'File' : ''}
          </td>
          <td>
            {item.perms}
          </td>
        </ContextMenuTrigger>
    );
  };

  render() {
    const viewmode = this.props.state.viewmode;
    const item = this.props.item;

    if (viewmode === 'grid') {
      return this.getGridItem(item);
    }
    else if (viewmode === 'list') {
      return this.getListItem(item);
    }
    else {
      return <div>Invalid viewmode</div>;
    }
  }

}

export default Item;