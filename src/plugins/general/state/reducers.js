import * as types from './types';

export default {
  [types.SET_WORKING_PATH]: (state, {payload}) => {
    return {
      ...state,
      general: {
        ...state.general,
        path: payload,
      },
    };
  },
  [types.SET_ENTRIES]: (state, {payload}) => {
    return {
      ...state,
      general: {
        ...state.general,
        entries: payload,
      },
    };
  },
  [types.TOGGLE_SELECT]: (state, {payload}) => {
    const entries = state.general.entries;
    if (payload.is_file) {
      entries.files = toggleSelect(entries.files, payload);
    }
    if (payload.is_dir) {
      entries.dirs = toggleSelect(entries.dirs, payload);
    }

    return {
      ...state,
      general: {
        ...state.general,
        entries,
      },
    };
  },
  [types.UPDATE]: (state, {payload}) => {
    const entries = state.general.entries;
    if (payload.is_file) {
      entries.files = findAndReplace(entries.files, payload);
    }
    if (payload.is_dir) {
      entries.dirs = findAndReplace(entries.dirs, payload);
    }

    return {
      ...state,
      general: {
        ...state.general,
        entries,
      },
    };
  },
};

function toggleSelect(list, item) {
  return list.map(_item => {
    if (item === _item) {
      _item.selected = !_item.selected;
    }
    return _item;
  });
}

function findAndReplace(list, item) {
  return list.map(_item => {
    if (item === _item) {
      _item = item;
    }
    return _item;
  });
}