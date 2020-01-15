import * as types from './types';

export const setWorkingPath = path => ({type: types.SET_WORKING_PATH, payload: path});
export const setEntries = entries => ({type: types.SET_ENTRIES, payload: {...entries}});
export const toggleSelect = item => ({type: types.TOGGLE_SELECT, payload: item});
