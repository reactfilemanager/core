import * as types from './types';

export const setWorkingPath = path => ({type: types.SET_WORKING_PATH, payload: path});
export const setEntries = entries => ({type: types.SET_ENTRIES, payload: entries});
export const toggleSelect = item => ({type: types.TOGGLE_SELECT, payload: item});
export const setShouldReload = (shouldReload) => ({type: types.SHOULD_RELOAD, payload: shouldReload});
export const setReloading = reloading => ({type: types.RELOADING, payload: reloading});
export const update = item => ({type: types.UPDATE, payload: item});
export const remove = item => ({type: types.REMOVE, payload: item});
export const setClipboard = items => ({type: types.SET_CLIPBOARD, payload: items});
export const resetDirectoryTree = shouldReset => ({type: types.RESET_DIRECTORY_TREE, payload: shouldReset});
export const setViewmode = viewmode => ({type: types.SET_VIEWMODE, payload: viewmode});