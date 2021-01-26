import React, {Component} from 'react';
import {Checkbox} from 'theme-ui';
import {
  dirsLoaded,
  setReloading, setSelectedItems,
} from '../../state/actions';
import {getApi, getDefaultHandler} from '../../tools/config';
import cloneDeep from 'lodash.clonedeep';
import {ContextMenuTrigger} from 'react-contextmenu';
import {CONTEXT_MENU_ID} from '../ContextMenu';
import {toast} from 'react-toastify';
import {EventBus, uuidv4} from '../../../helpers/Utils';
import {
  ADD_FILTER,
  CORE_RELOAD_FILEMANAGER,
  FORCE_RENDER, GET_CURRENT_DIR,
  GET_CURRENT_DIRS,
  ITEMS_SELECTED,
  REMOVE,
  REMOVE_FILTER, SELECT_FILE,
  SET_VIEWMODE,
  SET_WORKING_PATH,
  TOGGLE_SELECT,
  UPDATE,
} from '../../state/types';
import GridItemListView from './GridItemListView';
import TableItemListView from './TableItemListView';

export const getSelectedItemProps = item => {
  return {
    id: item.id,
    name: item.name,
    path: item.path,
    last_modified: new Date,
    is_dir: item.is_dir,
  };
};

class ItemList extends Component {

  state = {
    working: false,
    entries: {
      dirs: [],
      files: [],
    },
    filters: {},
    path: '',
    viewmode: 'grid',
    selected_entries: {},
  };

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
    EventBus.$on(GET_CURRENT_DIR, this.sendCurrentDir);
    EventBus.$on(GET_CURRENT_DIRS, this.sendCurrentDirs);
    EventBus.$on(SELECT_FILE, this.handleFileSelect);
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
    EventBus.$off(GET_CURRENT_DIR, this.sendCurrentDir);
    EventBus.$off(GET_CURRENT_DIRS, this.sendCurrentDirs);
    EventBus.$off(SELECT_FILE, this.handleFileSelect);
  }

  handleFileSelect = file => {
    const handler = getDefaultHandler(file);
    if (!handler) {
      alert('Unsupported file');
    }
    handler.handle(file);
  };

  sendCurrentDir = callback => {
    if (typeof callback === 'function') {
      callback(this.state.path);
    }
  };

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
    this.setState({max: this.max});
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
    const selected_entries = {};
    for (const item of items) {
      selected_entries[item.id] = item;
    }
    this.setState({selected_entries});
  };

  onRemove = item => {
    const {entries, selected_entries} = this.state;
    const remove = _item => {
      return _item.id !== item.id;
    };

    if (selected_entries[item.id] !== undefined) {
      delete selected_entries[item.id];
      setSelectedItems(Object.values(selected_entries));
    }

    entries.dirs = entries.dirs.filter(remove);
    entries.files = entries.files.filter(remove);
    this.setState({entries, selected_entries});
  };

  onUpdate = item => {
    const {entries, selected_entries} = this.state;
    const update = _item => {
      if (_item.id === item.id) {
        const prevId = _item.id;
        _item.id = uuidv4();
        _item.name = item.name;
        _item.perms = item.perms;
        _item.last_modified = new Date;
        _item.extra = item.extra;

        if (selected_entries[prevId]) {
          delete selected_entries[prevId];
          selected_entries[_item.id] = this.getSelectedItemProps(_item);
        }
      }
      return _item;
    };

    entries.dirs = entries.dirs.map(update);
    entries.files = entries.files.map(update);

    this.setState({entries, selected_entries});
  };

  // region toggle select
  toggleSelect = ({ctrlKey, shiftKey, item_id}) => {
    let shouldMark = false;
    let {selected_entries} = this.state;
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
    this.setState({selected_entries});
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

    let selected = this.state.selected_entries[item.id] !== undefined;
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

  // region utilities
  readPath = (path, callback) => {
    setReloading(true);
    this.setState({reloading: true});
    getApi().list(path).then(entries => {
      if (callback && typeof callback === 'function') {
        entries = callback(entries);
      }
      dirsLoaded(path, entries.dirs);

      this.setState({entries, selected_entries: {}});
      setSelectedItems([]);

    }).catch(error => {
      console.log(error);
      toast.error(error.message);
    }).finally(() => {
      setReloading(false);
      this.setState({reloading: false});
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
    this.setState({selected_entries});
    setSelectedItems(Object.values(selected_entries));
  };

  handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
    this.markAll(false);
  };

  getSelectedItems = () => {
    return Object.values(this.state.selected_entries);
  };

  handleContextMenu = () => {
    this.markAll(false);
  };

  // endregion

  // region rendering
  getItemsBlockForListViewMode = items => {
    const allChecked = Object.keys(this.state.selected_entries).length === this.state.entries.dirs.length +
      this.state.entries.files.length;

    return (
      <table className="fm-list-table">
        <thead>
        <tr>
          <th width="1%" onClick={this.toggleCheckAll}>
            <label>
              <Checkbox checked={allChecked} ref="allCheck" onChange={e => e} />
            </label>
          </th>
          <th width="75%">Name</th>
          <th width="3%">Size</th>
          <th width="10%">Permission</th>
          <th width="10%">Last Modified</th>
        </tr>
        </thead>
        <TableItemListView
          selectedItems={this.selectedItems}
          items={items}
          moveTo={this.setWorkingPath}
          reloading={this.state.reloading} />
      </table>
    );
  };

  getItems = () => {
    return Object.values(this.state.filters).reduce((entries, fn) => {
      return fn(entries);
    }, cloneDeep(this.state.entries));
  };

  getAttributes = () => {
    return {
      style: {userSelect: 'none'},
      onClick: this.handleClick,
      onContextMenu: this.handleContextMenu,
      id: 'fm-content-holder',
      className: 'fm-height-100',
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

  get selectedItems() {
    return Object.keys(this.state.selected_entries);
  }

  render() {
    const items = this.getItems();
    const {viewmode, working, reloading} = this.state;

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
        {reloading ?
          <div>
            <div style={{
              textAlign: 'center',
              marginTop: '50px',
            }}>
              <svg viewBox="0 0 32 32" width="48" height="48" strokeWidth="4" fill="none" stroke="currentcolor"
                   role="img" className="css-qhckx3">
                <title>Loading...</title>
                <circle cx="16" cy="16" r="12" opacity="0.125" />
                <circle cx="16" cy="16" r="12" strokeDasharray="75.39822368615503" strokeDashoffset="56.548667764616276"
                        className="svg-spin" />
              </svg>
            </div>
          </div>
          :
          <>
            {
              viewmode === 'grid'
                ? <GridItemListView
                  selectedItems={this.selectedItems}
                  items={items}
                  moveTo={this.setWorkingPath}
                  reloading={reloading} />
                : this.getItemsBlockForListViewMode(items)
            }
            {working ?
              <svg viewBox="0 0 32 32" width="48" height="48" strokeWidth="4" fill="none" stroke="currentcolor"
                   role="img" className="css-qhckx3">
                <title>Loading...</title>
                <circle cx="16" cy="16" r="12" opacity="0.125" />
                <circle cx="16" cy="16" r="12" strokeDasharray="75.39822368615503" strokeDashoffset="56.548667764616276"
                        className="svg-spin" />
              </svg>
              : null}
          </>
        }
        <div ref="bottom" />
      </ContextMenuTrigger>
    );
  }

  // endregion
}

export default ItemList;
