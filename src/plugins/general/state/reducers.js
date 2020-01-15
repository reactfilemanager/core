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
    return {
      ...state,
      general: {
        ...state.general,
        entries: {
          files: findAndReplace(state.general.entries.files, payload),
          dirs: findAndReplace(state.general.entries.dirs, payload),
        },
      },
    };
  },
  [types.SHOULD_RELOAD]: (state, {payload}) => {
    return {
      ...state,
      general: {
        ...state.general,
        shouldReload: payload,
      },
    };
  },
  [types.REMOVE]: (state, {payload}) => {
    return {
      ...state,
      general: {
        ...state.general,
        entries: {
          files: findAndRemove(state.general.entries.files, payload),
          dirs: findAndRemove(state.general.entries.dirs, payload),
        },
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

function findAndRemove(list, item) {
  return list.filter(_item => _item !== item);
}
