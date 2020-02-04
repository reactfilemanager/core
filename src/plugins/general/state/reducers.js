import * as types from './types';

export default {
  [types.SET_WORKING_PATH]: (state, {payload}) => {
    return {
      ...state,
      general: {
        ...state.general,
        path: payload.replace(/\/\//g, '/').replace(/\/$/, ''),
        shouldReload: true,
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
  [types.RESET_DIRECTORY_TREE]: (state, {payload}) => {
    return {
      ...state,
      general: {
        ...state.general,
        resetDirectoryTree: payload,
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
  [types.RELOADING]: (state, {payload}) => {
    return {
      ...state,
      general: {
        ...state.general,
        reloading: payload,
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
  [types.SET_CLIPBOARD]: (state, {payload}) => {
    return {
      ...state,
      general: {
        ...state.general,
        clipboard: payload,
      },
    };
  },
  [types.SET_VIEWMODE]: (state, {payload}) => {
    return {
      ...state,
      general: {
        ...state.general,
        viewmode: payload,
      },
    };
  },
  [types.SET_QUERY]: (state, {payload}) => {
    return {
      ...state,
      general: {
        ...state.general,
        search: {
          ...state.general.search,
          query: payload,
        },
      },
    };
  },
  [types.SET_SORT]: (state, {payload}) => {
    return {
      ...state,
      general: {
        ...state.general,
        search: {
          ...state.general.search,
          sort: payload,
        },
      },
    };
  },
  [types.SET_SORT_BY]: (state, {payload}) => {
    return {
      ...state,
      general: {
        ...state.general,
        search: {
          ...state.general.search,
          sortBy: payload,
        },
      },
    };
  },
  [types.SET_TYPE_FILTER]: (state, {payload}) => {
    return {
      ...state,
      general: {
        ...state.general,
        type: payload,
      },
    };
  },
  [types.ADD_FILTER]: (state, {payload}) => {
    return {
      ...state,
      general: {
        ...state.general,
        filters: {
          ...state.general.filters,
          ...payload,
        },
      },
    };
  },
  [types.INJECT_SIDE_PANEL]: (state, {payload}) => {
    return {
      ...state,
      general: {
        ...state.general,
        sidebar_components: {
          ...state.general.sidebar_components,
          ...payload,
        },
      },
    };
  },
  [types.REMOVE_SIDE_PANEL]: (state, {payload}) => {
    const sidebar_components = {};//state.general.sidebar_components;
    // if (sidebar_components[payload]) {
    //   delete sidebar_components[payload];
    // }

    return {
      ...state,
      general: {
        ...state.general,
        sidebar_components: {},
      },
    };
  },
  [types.INJECT_MODAL]: (state, {payload}) => {
    return {
      ...state,
      general: {
        ...state.general,
        modal: payload,
      },
    };
  },
  [types.REMOVE_MODAL]: (state) => {
    return {
      ...state,
      general: {
        ...state.general,
        modal: null,
      },
    };
  },
};

function toggleSelect(list, item) {
  return list.map(_item => {
    if (item.id === _item.id) {
      _item.selected = !_item.selected;
    }
    return _item;
  });
}

function findAndReplace(list, item) {
  return list.map(_item => {
    if (item.id === _item.id) {
      _item = item;
    }
    return _item;
  });
}

function findAndRemove(list, item) {
  return list.filter(_item => item.id === _item.id);
}
