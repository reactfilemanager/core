import * as types from './types';
import {EventBus} from '../../helpers/Utils';

export const getWorkingPath = callback => {
  EventBus.$emit('READ', {
    id: types.SET_WORKING_PATH,
    callback,
  });
};
export const setWorkingPath = path => {
  path = path.replace(/\/\//g, '/').replace(/\/$/, '');
  EventBus.$emit('STORE', {
    id: types.WORKING_PATH,
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
export const getSelectedItems = callback => {
  EventBus.$emit('READ', {
    id: types.ITEMS_SELECTED,
    callback,
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







export const setEntries = entries => ({type: types.SET_ENTRIES, payload: entries});
export const setShouldReload = (callback) => {
  EventBus.$emit(types.CORE_RELOAD_FILEMANAGER, callback);
};

export const setReloading = reloading => ({type: types.RELOADING, payload: reloading});
export const update = item => ({type: types.UPDATE, payload: item});
export const remove = item => ({type: types.REMOVE, payload: item});
export const setClipboard = items => ({type: types.SET_CLIPBOARD, payload: items});
export const resetDirectoryTree = shouldReset => ({type: types.RESET_DIRECTORY_TREE, payload: shouldReset});
export const setDirectoryTree = payload => ({type: types.SET_DIRECTORY_TREE, payload});
export const setViewmode = viewmode => ({type: types.SET_VIEWMODE, payload: viewmode});
export const setQuery = query => ({type: types.SET_QUERY, payload: query});
export const addFilter = filter => ({type: types.ADD_FILTER, payload: filter});
export const setSort = sort => ({type: types.SET_SORT, payload: sort});
export const setSortBy = sort_by => ({type: types.SET_SORT_BY, payload: sort_by});
export const setTypeFilter = payload => ({type: types.SET_TYPE_FILTER, payload});
export const injectComponent = component => ({type: types.INJECT_COMPONENT, payload: component});
export const removeInjectedComponent = () => ({type: types.REMOVE_INJECTED_COMPONENT});