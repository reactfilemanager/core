/** @jsx jsx */
import {jsx, Card, Text, Image, Link, Flex} from 'theme-ui';
import {Component} from 'react';
import {setEntries} from '../../state/actions';
import {ContextMenuTrigger} from 'react-contextmenu';
import {CONTEXT_MENU_ID} from '../ContextMenu';
import cloneDeep from 'lodash.clonedeep';

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
        if (!shouldMark && (item.id === lastSelectedItem.id || item.id === self.props.item.id)) {
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

        if (!skip && shouldMark && (item.id === lastSelectedItem.id || item.id === self.props.item.id)) {
          // marking end
          shouldMark = false;
        }
        return item;
      }

      const entries = cloneDeep(this.props.state.entries);
      const items = Object.values(this.props.state.filters).reduce((entries, fn) => {
        return fn(entries);
      }, entries);

      const dirs = items.dirs.map(dir => mark(dir));
      const files = items.files.map(file => mark(file));

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

    if (this.props.item.id === item.id) {
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
      onContextMenu: this.handleContextMenu,
    };
  };

  get className() {
    const className = ['fm-item'];
    if (this.props.item.selected) {
      className.push('fm-item-selected');
    }
    return className.join(' ');
  }

  getGridItem = (item) => {
    return (
        <Card className={this.className}>
          <ContextMenuTrigger
            key={item.id}
            id={CONTEXT_MENU_ID}
            holdToDisplay={1000}
            name={item.name}
            collect={this.collect}
            attributes={this.getAttributes(item)}
            style={{ height: '100%' }}
          >
            {
              item.is_dir ?
                  <div
                      sx={{
                        display: 'flex',
                      }}>
                    <Image src={thumb(item.path)} sx={{
                      width: 32,
                      maxWidth: 32,
                      mr: 2,
                    }}/>
                    <Link
                        sx={{
                          textDecoration: 'none',
                          color: 'black',
                        }}
                        href="#!"
                        onClick={this.handleClickName}>{item.getName(8)}</Link>
                  </div> :
                  <Flex sx={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '100%'
                  }}>
                    <div sx={{
                      position: 'relative',
                      width: '100%',
                      height: '140px',
                      overflow: 'hidden'
                    }}>
                      <div sx={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Image 
                        src={thumb(item.path)}
                        sx={{
                          paddingBottom: '5px',
                        }}/>
                      </div>
                    </div>
                    <Text sx={{
                      width: '100%',
                      borderTop: '1px solid #eee',
                      paddingTop: '4px',
                      textAlign: 'center',
                      fontSize: 12,
                      color: 'gray'
                    }}>{item.getName(8)} {item.components}</Text>
                  </Flex>
            }


          </ContextMenuTrigger>
        </Card>
    );
  };

  getListItem = (item) => {
    return (
        <ContextMenuTrigger
            key={item.id}
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
                  ? <a href="#" onClick={this.handleClickName}> {item.name} </a> : item.name
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