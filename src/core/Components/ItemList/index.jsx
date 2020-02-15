/** @jsx jsx */
import {jsx, Text, Grid, Checkbox, Label, Flex, Spinner} from 'theme-ui';
import React, {Component} from 'react';
import styled from '@emotion/styled';
import {
  dirsLoaded,
  resetDirectoryTree,
  setEntries,
  setReloading, setSelectedItems,
  setShouldReload,
  setWorkingPath,
} from '../../state/actions';
import Item from './Item';
import {getApi} from '../../tools/config';
import cloneDeep from 'lodash.clonedeep';
import {ContextMenuTrigger} from 'react-contextmenu';
import {CONTEXT_MENU_ID} from '../ContextMenu';
import {toast} from 'react-toastify';
import {getSelectedItems} from '../../models/FileInfo';
import debounce from 'lodash.debounce';
import {EventBus, uuidv4} from '../../../helpers/Utils';
import {
  ADD_FILTER,
  CORE_RELOAD_FILEMANAGER, FORCE_RENDER, GET_CURRENT_DIRS,
  ITEMS_SELECTED,
  REMOVE, REMOVE_FILTER, SET_VIEWMODE,
  SET_WORKING_PATH,
  TOGGLE_SELECT,
  UPDATE,
} from '../../state/types';

export const getSelectedItemProps = item => {
  return {
    id: item.id,
    name: item.name,
    path: item.path,
    last_modified: new Date,
  };
};

class ItemList extends Component {

  state = {
    max: 40,
    total: 0,
    working: false,
    entries: {
      dirs: [],
      files: [],
    },
    filters: {},
    path: '',
    viewmode: 'grid',
    render: 1,
  };
  selected_entries = {};
  max = 40;
  increment = 20;

  componentDidMount() {
    EventBus.$on(FORCE_RENDER, this.forceRender);
    EventBus.$on(CORE_RELOAD_FILEMANAGER, this.reload);
    EventBus.$on(SET_WORKING_PATH, this.setWorkingPath);
    EventBus.$on(TOGGLE_SELECT, this.toggleSelect);
    EventBus.$on(UPDATE, this.onUpdate);
    EventBus.$on(REMOVE, this.onRemove);
    EventBus.$on(ITEMS_SELECTED, this.onItemsSelected);
    EventBus.$on(ADD_FILTER, this.addFilter);
    EventBus.$on(REMOVE_FILTER, this.removeFilter);
    EventBus.$on(SET_VIEWMODE, this.setViewMode);
    EventBus.$on(GET_CURRENT_DIRS, this.sendCurrentDirs);
    this.getMain().addEventListener('scroll', this.infiniteLoader);
  }

  componentWillUnmount() {
    EventBus.$off(FORCE_RENDER, this.forceRender);
    EventBus.$off(CORE_RELOAD_FILEMANAGER, this.reload);
    EventBus.$off(SET_WORKING_PATH, this.setWorkingPath);
    EventBus.$off(TOGGLE_SELECT, this.toggleSelect);
    EventBus.$off(UPDATE, this.onUpdate);
    EventBus.$off(REMOVE, this.onRemove);
    EventBus.$off(ITEMS_SELECTED, this.onItemsSelected);
    EventBus.$off(ADD_FILTER, this.addFilter);
    EventBus.$off(REMOVE_FILTER, this.removeFilter);
    EventBus.$off(SET_VIEWMODE, this.setViewMode);
    EventBus.$off(GET_CURRENT_DIRS, this.sendCurrentDirs);
    this.getMain().removeEventListener('scroll', this.infiniteLoader);
  }

  sendCurrentDirs = callback => {
    if (typeof callback === 'function') {
      callback({
        path: this.state.path,
        dirs: this.state.entries.dirs,
      });
    }
  };

  setViewMode = viewmode => {
    this.setState({viewmode});
  };

  forceRender = () => {
    this.forceUpdate();
  };

  addFilter = (_filters) => {
    let {filters} = this.state;
    filters = {...filters, ..._filters};
    this.setState({filters});
  };

  removeFilter = (id) => {
    const {filters} = this.state;
    if (filters[id]) {
      delete filters[id];
      this.setState({filters});
    }
  };

  onItemsSelected = items => {
    this.selected_entries = {};
    for (const item of items) {
      this.selected_entries[item.id] = item;
    }
  };

  onRemove = item => {
    const {entries} = this.state;
    const remove = _item => {
      return _item.id !== item.id;
    };

    if (this.selected_entries[item.id] !== undefined) {
      delete this.selected_entries[item.id];
      setSelectedItems(Object.values(this.selected_entries));
    }

    entries.dirs = entries.dirs.filter(remove);
    entries.files = entries.files.filter(remove);
    this.setState({entries});
  };

  onUpdate = item => {
    const {entries} = this.state;
    const update = _item => {
      if (_item.id === item.id) {
        const prevId = _item.id;
        _item.id = uuidv4();
        _item.name = item.name;
        _item.perms = item.perms;
        _item.last_modified = new Date;

        if (this.selected_entries[prevId]) {
          delete this.selected_entries[prevId];
          this.selected_entries[_item.id] = this.getSelectedItemProps(_item);
        }
      }
      return _item;
    };

    entries.dirs = entries.dirs.map(update);
    entries.files = entries.files.map(update);

    this.setState({entries});
  };

  // region toggle select
  toggleSelect = ({ctrlKey, shiftKey, item_id}) => {
    let shouldMark = false;
    let selected_entries = this.selected_entries;
    const lastSelectedItem = this.findLastSelected();

    const {dirs, files} = this.state.entries;

    if (shiftKey && lastSelectedItem && lastSelectedItem.id !== item_id) {
      const mark = item => {
        let skip = false;
        if (!shouldMark && (item.id === lastSelectedItem.id || item.id === item_id)) {
          // marking start
          shouldMark = true;
          skip = true;
        }

        if (shouldMark) {
          selected_entries[item.id] = {
            ...this.getSelectedItemProps(item),
            selection_time: lastSelectedItem.selection_time - (lastSelectedItem.id !== item.id ? 100 : 0),
          };
        }
        else {
          delete selected_entries[item.id];
        }

        if (!skip && shouldMark && (item.id === lastSelectedItem.id || item.id === item_id)) {
          // marking end
          shouldMark = false;
        }
      };

      dirs.map(mark);
      files.map(mark);
    }
    else {
      selected_entries = {};
      const mark = item => {
        if (item.selected) {
          selected_entries[item.id] = this.getSelectedItemProps(item);
        }
      };

      dirs.map(dir => this.markItemSelected(item_id, dir, ctrlKey, shiftKey)).map(mark);
      files.map(file => this.markItemSelected(item_id, file, ctrlKey, shiftKey)).map(mark);
    }
    this.selected_entries = selected_entries;
    setSelectedItems(Object.values(selected_entries));
  };

  findLastSelected = () => {
    const items = this.getSelectedItems().sort((a, b) => a.selection_time < b.selection_time ? 1 : -1);
    if (items.length) {
      return items.shift();
    }
    return null;
  };

  markItemSelected = (item_id, item, ctrlKey) => {
    if (item_id !== item.id && !ctrlKey) {
      return {selected: false};
    }

    let selected = this.selected_entries[item.id] !== undefined;
    if (item_id === item.id) {
      return {
        ...this.getSelectedItemProps(item),
        selected: ctrlKey ? !selected : true,
      };
    }

    return {
      ...this.getSelectedItemProps(item),
      selected,
    };
  };

  getSelectedItemProps = item => {
    return getSelectedItemProps(item);
  };
  // endregion

  // region handler

  // endregion

  setWorkingPath = path => {
    this.setState({path});
    this.readPath(path);
  };

  reload = callback => {
    this.readPath(this.state.path, callback);
  };

  // region infinite loader
  getMain = () => {
    const main = this.refs.bottom.parentElement.parentElement;
    if (main.tagName !== 'MAIN') {
      throw new Error('Container could not be detected');
    }
    return main;
  };

  infiniteLoader = debounce(e => {
    const offsetTop = this.refs.bottom.getBoundingClientRect().top;
    const clientHeight = this.getMain().clientHeight;
    if (offsetTop - 100 > clientHeight) {
      return;
    }

    if (this.state.max < this.state.total) {
      let max = this.state.max + this.increment;
      if (max > this.state.total) {
        max = this.state.total;
      }
      this.setState({working: true});
      setTimeout(() => {
        this.setState({max, working: false});
      }, 500);
    }
  }, 100);

  // endregion

  // region utilities
  readPath = (path, callback) => {
    setReloading(true);
    getApi().list(path).then(entries => {
      if (callback && typeof callback === 'function') {
        entries = callback(entries);
      }
      const total = entries.dirs.length + entries.files.length;
      let state = {entries};
      if (total > this.max) {
        state = {...state, max: this.max, total};
      }
      dirsLoaded(path, entries.dirs);
      this.setState(state);
      this.selected_entries = {};
    }).catch(error => {
      console.log(error);
      toast.error(error.message);
    }).finally(() => {
      setReloading(false);
    });
  };

  toggleCheckAll = e => {
    e.preventDefault();
    e.stopPropagation();

    const checked = !this.refs.allCheck.checked;
    this.markAll(checked);
  };

  markAll = checked => {
    let selected_entries = {};
    if (checked) {
      const mark = item => {
        selected_entries[item.id] = {
          id: item.id,
          selection_time: new Date(),
        };
      };
      this.state.entries.dirs.forEach(mark);
      this.state.entries.files.forEach(mark);
    }
    else {
      selected_entries = [];
    }
    this.selected_entries = selected_entries;
    setSelectedItems(Object.values(selected_entries));
    this.forceUpdate();
  };

  handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
    this.markAll(false);
  };

  getSelectedItems = () => {
    return Object.values(this.selected_entries);
  };

  handleContextMenu = e => {
    this.markAll(false);
  };

  // endregion

  // region rendering

  getItemBlock = (item) => {
    return (
        <Item key={item.id} item={item} viewmode={this.state.viewmode} moveTo={this.setWorkingPath}/>
    );
  };

  getItemsBlockForGridViewMode = (items) => {
    if (items.dirs.length === 0 && items.files.length === 0) {
      return (
          <Flex sx={{
            height: '70vh',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {
              this.state.reloading ?
                  <Spinner/> :
                  <Text>No entry in this directory</Text>}
          </Flex>
      );
    }

    return (<div sx={{p: 3}}>
      {items.dirs.length
          ? (<>
            <Text sx={{
              p: 2,
              my: 2,
              textTransform: 'uppercase',
              fontSize: 13,
              color: 'gray',
            }}>Folders</Text>

            <Grid
                columns={4}
                gap={3}
            >
              {items.dirs.map(item => this.getItemBlock(item))}
            </Grid>
          </>)
          : null}

      {items.files.length
          ? (<>      <Text sx={{
            px: 2,
            my: 3,
            textTransform: 'uppercase',
            fontSize: 13,
            color: 'gray',
          }}>Files</Text>

            <Grid
                width={[176]}
                gap={3}
                sx={{
                  '.react-contextmenu-wrapper': {
                    height: '100%',
                  },
                }}>
              {items.files.map(item => this.getItemBlock(item))}
            </Grid>
          </>)
          : null}
    </div>);
  };

  getItemsBlockForListViewMode = items => {
    const _items = [...items.dirs, ...items.files];
    const allChecked = Object.keys(this.selected_entries).length === this.state.entries.dirs.length +
        this.state.entries.files.length;

    return (
        <Table sx={{
          width: '100%',
          minWidth: '100%',
          borderSpacing: 0,
        }}>
          <thead>
          <tr>
            <TH width="1%" onClick={this.toggleCheckAll}>
              <Label>
                <Checkbox checked={allChecked} ref="allCheck" onChange={e => e}/>
              </Label>
            </TH>
            <TH width="1%"/>
            <TH width="75%">Name</TH>
            <TH width="3%">Size</TH>
            <TH width="10%">Permission</TH>
            <TH width="10%">Last Modified</TH>
          </tr>
          </thead>
          <tbody>
          {_items.length
              ? _items.map(item => this.getItemBlock(item))
              : <tr>
                <td colSpan={6} sx={{textAlign: 'center'}}>Empty</td>
              </tr>
          }
          </tbody>
        </Table>
    );
  };

  getItems = () => {
    let entries = Object.values(this.state.filters).reduce((entries, fn) => {
      return fn(entries);
    }, cloneDeep(this.state.entries));
    const maxFiles = this.state.max > entries.files.length ? entries.files.length : this.state.max;
    entries = {
      dirs: entries.dirs,
      files: entries.files.slice(0, maxFiles),
    };
    return entries;
  };

  getAttributes = () => {
    return {
      style: {userSelect: 'none'},
      onClick: this.handleClick,
      onContextMenu: this.handleContextMenu,
      id: 'fm-content-holder',
    };
  };

  collect = () => {
    return {
      item: {
        path: this.state.path,
        isCurrentDir: true,
      },
    };
  };

  render() {
    const items = this.getItems();

    return (
        <ContextMenuTrigger
            ref="root"
            key={this.state.path}
            id={CONTEXT_MENU_ID}
            holdToDisplay={1000}
            name={this.state.path}
            collect={this.collect}
            attributes={this.getAttributes()}
            renderTag="div"
        >
          {this.state.viewmode === 'grid'
              ? this.getItemsBlockForGridViewMode(items)
              : this.getItemsBlockForListViewMode(items)
          }
          {this.state.working ? <Spinner/> : null}
          <div ref="bottom"/>
        </ContextMenuTrigger>
    );
  }

  // endregion
}

export default ItemList;

const Table = styled.table`
  // border: 1px solid #dcdcdc;
  //Row
  tr:nth-of-type(odd) td{ background: #fff }
  tr:nth-of-type(even) td{ background: #f5f4f4 }
  // Hover
  tr:hover td{ background: #e7e7ff;}
`;

const TH = styled.th`
  border-bottom: 1px solid #dcdcdc;
  z-index: 1;
  padding: 8px;
  white-space: nowrap;
  background: #fbfafa;
  font-size: 11px;
  text-align: left;
  font-weight: 500;
  text-transform: uppercase;
`;