import React, {Component} from 'react';
import {Checkbox} from 'theme-ui'
import {
  dirsLoaded,
  setReloading, setSelectedItems,
} from '../../state/actions';
import Item from './Item';
import {getApi} from '../../tools/config';
import cloneDeep from 'lodash.clonedeep';
import {ContextMenuTrigger} from 'react-contextmenu';
import {CONTEXT_MENU_ID} from '../ContextMenu';
import {toast} from 'react-toastify';
import debounce from 'lodash.debounce';
import {EventBus, uuidv4} from '../../../helpers/Utils';
import {
  ADD_FILTER,
  CORE_RELOAD_FILEMANAGER,
  FORCE_RENDER, GET_CURRENT_DIR,
  GET_CURRENT_DIRS,
  ITEMS_SELECTED,
  REMOVE,
  REMOVE_FILTER,
  SET_VIEWMODE,
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
    is_dir: item.is_dir,
  };
};

class ItemList extends Component {

  state = {
    max: 40,
    working: false,
    entries: {
      dirs: [],
      files: [],
    },
    filters: {},
    path: '',
    viewmode: 'grid',
  };
  selected_entries = {};
  max = 40;
  increment = 30;
  total = 0;

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
    EventBus.$off(GET_CURRENT_DIR, this.sendCurrentDir);
    EventBus.$off(GET_CURRENT_DIRS, this.sendCurrentDirs);
    this.getMain().removeEventListener('scroll', this.infiniteLoader);
  }

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
        _item.extra = item.extra;

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
    if (offsetTop - 400 > clientHeight) {
      return;
    }

    if (this.state.max >= this.total) {
      return;
    }

    let max = this.state.max + this.increment;
    if (max > this.total) {
      max = this.total;
    }

    if (max !== this.state.max) {
      this.setState({max});
    }
  }, 100);

  // endregion

  // region utilities
  readPath = (path, callback) => {
    setReloading(true);
    this.setState({reloading: true});
    getApi().list(path).then(entries => {
      if (callback && typeof callback === 'function') {
        entries = callback(entries);
      }
      dirsLoaded(path, entries.dirs);

      const total_dirs = entries.dirs.length;
      const total_files = entries.files.length;
      this.total = total_dirs + total_files;

      let state = {entries};
      if (total_dirs > 80) {
        state = {...state, max: 80};
      }
      else if (this.total > total_dirs + this.max) {
        state = {...state, max: this.max};
      }
      else {
        state = {...state, max: total_dirs + this.increment};
      }

      this.setState(state);
      this.selected_entries = {};
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
        <div className="fm-flex fm-flex-center fm-height-100">
          {
            this.state.reloading ?
              <div>Spinner</div> :
              <h4>No entry in this directory</h4>}
        </div>
      );
    }

    return (<div className="fm-p-3">
      {items.dirs.length
        ? (<>
          <h4>Folders</h4>

          <div className="fm-grid-4">
            {items.dirs.map(item => this.getItemBlock(item))}
          </div>
        </>)
        : null}

      {items.files.length
        ? (<>      
          <h4>Files</h4>

          <div className="fm-grid-4">
            {items.files.map(item => this.getItemBlock(item))}
          </div>
        </>)
        : null}
    </div>);
  };

  getItemsBlockForListViewMode = items => {
    const _items = [...items.dirs, ...items.files];
    const allChecked = Object.keys(this.selected_entries).length === this.state.entries.dirs.length +
      this.state.entries.files.length;

    return (
      <table>
        <thead>
        <tr>
          <th width="1%" onClick={this.toggleCheckAll}>
            <label>
              <Checkbox checked={allChecked} ref="allCheck" onChange={e => e}/>
            </label>
          </th>
          <th width="1%"/>
          <th width="75%">Name</th>
          <th width="3%">Size</th>
          <th width="10%">Permission</th>
          <th width="10%">Last Modified</th>
        </tr>
        </thead>
        <tbody>
        {_items.length
          ? _items.map(item => this.getItemBlock(item))
          : <tr>
            <td colSpan={6}>Empty</td>
          </tr>
        }
        </tbody>
      </table>
    );
  };

  getItems = () => {
    let entries = Object.values(this.state.filters).reduce((entries, fn) => {
      return fn(entries);
    }, cloneDeep(this.state.entries));

    this.total = entries.dirs.length + entries.files.length;

    const total_dirs = entries.dirs.length;
    let maxDirs = 0;

    if (total_dirs < this.state.max) {
      maxDirs = total_dirs;
    }
    else {
      maxDirs = this.state.max;
    }

    entries = {
      dirs: entries.dirs.slice(0, maxDirs),
      files: entries.files.slice(0, this.state.max - maxDirs),
    };

    return entries;
  };

  getAttributes = () => {
    return {
      style: {userSelect: 'none'},
      onClick: this.handleClick,
      onContextMenu: this.handleContextMenu,
      id: 'fm-content-holder',
      className: 'fm-height-100'
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
        {this.state.reloading ?
          <div>
            <div>Spinner</div>
          </div>
          :
          <>
            {
              this.state.viewmode === 'grid'
                ? this.getItemsBlockForGridViewMode(items)
                : this.getItemsBlockForListViewMode(items)
            }
            {this.state.working ?
              <div>
                Spinner
              </div>
              : null}
          </>
        }
        <div ref="bottom"/>
      </ContextMenuTrigger>
    );
  }

  // endregion
}

export default ItemList;

// const Table = styled.table`
//   // border: 1px solid #dcdcdc;
//   //Row
//   tr:nth-of-type(odd) td{ background: #fff }
//   tr:nth-of-type(even) td{ background: #f5f4f4 }
//   // Hover
//   tr:hover td{ background: #e7e7ff;}
// `;

// const TH = styled.th`
//   border-bottom: 1px solid #dcdcdc;
//   z-index: 1;
//   padding: 8px;
//   white-space: nowrap;
//   background: #fbfafa;
//   font-size: 11px;
//   text-align: left;
//   font-weight: 500;
//   text-transform: uppercase;
// `;
