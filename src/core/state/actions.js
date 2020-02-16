import * as types from './types';
import {EventBus} from '../../helpers/Utils';
import {CORE_PLUGIN_KEY} from '../plugin';

export const getWorkingPath = () => {
  return new Promise((resolve, reject) => {
    EventBus.$emit('READ', {
      store: CORE_PLUGIN_KEY,
      id: types.WORKING_PATH,
      callback: resolve,
    });
  });
};

export const setWorkingPath = path => {
  path = path.replace(/\/\//g, '/').replace(/\/$/, '');
  EventBus.$emit('STORE', {
    id: types.SET_WORKING_PATH,
    value: path,
  });
  EventBus.$emit(types.SET_WORKING_PATH, path);
};

export const setSelectedItems = items => {
  EventBus.$emit('STORE', {
    id: types.SET_SELECTED_ITEMS,
    value: items,
  });
  EventBus.$emit(types.ITEMS_SELECTED, items);
};
export const getSelectedItems = () => {
  return new Promise((resolve, reject) => {
    EventBus.$emit('READ', {
      store: CORE_PLUGIN_KEY,
      id: types.ITEMS_SELECTED,
      callback: resolve,
    });
  });
};

export const injectModal = modal => {
  EventBus.$emit(types.INJECT_MODAL, modal);
};
export const removeModal = () => {
  EventBus.$emit(types.REMOVE_MODAL);
};

export const injectSidePanel = (id, panel) => {
  EventBus.$emit(types.INJECT_SIDE_PANEL, {id, panel});
};
export const removeSidePanel = id => {
  EventBus.$emit(types.REMOVE_SIDE_PANEL, id);
};

export const toggleSelect = (ctrlKey, shiftKey, item_id) => {
  EventBus.$emit(types.TOGGLE_SELECT, {ctrlKey, shiftKey, item_id});
};

export const update = item => {
  EventBus.$emit(types.UPDATE, item);
};

export const remove = item => {
  EventBus.$emit(types.REMOVE, item);
};

export const setFilter = filters => {
  EventBus.$emit(types.SET_FILTER, filters);
};

export const addFilter = filter => {
  EventBus.$emit(types.ADD_FILTER, filter);
};

export const removeFilter = filter => {
  EventBus.$emit(types.REMOVE_FILTER, filter);
};

export const forceRender = () => {
  EventBus.$emit(types.FORCE_RENDER);
};

export const setViewmode = viewmode => {
  EventBus.$emit(types.SET_VIEWMODE, viewmode);
};

export const getCurrentDirs = () => {
  return new Promise((resolve, reject) => {
    EventBus.$emit(types.GET_CURRENT_DIRS, resolve);
  });
};

export const getDirectoryTreeState = () => {
  return new Promise((resolve, reject) => {
    EventBus.$emit(types.GET_DIRECTORY_TREE_STATE, resolve);
  });
};

export const dirsLoaded = (path, dirs) => {
  EventBus.$emit(types.DIRS_LOADED, {path, dirs});
};

export const setShouldReload = (callback) => {
  EventBus.$emit(types.CORE_RELOAD_FILEMANAGER, callback);
};

export const setReloading = reloading => {
  EventBus.$emit(types.RELOADING, reloading);
};

export const resetDirectoryTree = (item) => {
  EventBus.$emit(types.RESET_DIRECTORY_TREE, item);
};
