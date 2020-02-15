import * as types from './types';

export default {
  [types.SET_SELECTED_ITEMS]: (state, payload) => {
    return {
      ...state,
      [types.ITEMS_SELECTED]: payload,
    };
  },
  [types.SET_WORKING_PATH]: (state, payload) => {
    return {
      ...state,
      [types.WORKING_PATH]: payload,
    };
  },

  [types.SET_ENTRIES]: (state, {payload}) => {
    return {
      ...state,
      core: {
        ...state.core,
        entries: payload,
      },
    };
  },
  [types.RESET_DIRECTORY_TREE]: (state, {payload}) => {
    return {
      ...state,
      core: {
        ...state.core,
        resetDirectoryTree: payload,
      },
    };
  },
  [types.SET_DIRECTORY_TREE]: (state, {payload}) => {
    return {
      ...state,
      core: {
        ...state.core,
        directoryTree: payload,
        resetDirectoryTree: true,
      },
    };
  },
  [types.TOGGLE_SELECT]: (state, {payload}) => {
    const entries = state.core.entries;
    if (payload.is_file) {
      entries.files = toggleSelect(entries.files, payload);
    }
    if (payload.is_dir) {
      entries.dirs = toggleSelect(entries.dirs, payload);
    }

    return {
      ...state,
      core: {
        ...state.core,
        entries,
      },
    };
  },
  [types.UPDATE]: (state, {payload}) => {
    return {
      ...state,
      core: {
        ...state.core,
        entries: {
          files: findAndReplace(state.core.entries.files, payload),
          dirs: findAndReplace(state.core.entries.dirs, payload),
        },
        resetDirectoryTree: payload.is_dir === true,
      },
    };
  },
  [types.SHOULD_RELOAD]: (state, {payload, callback}) => {
    return {
      ...state,
      core: {
        ...state.core,
        shouldReload: payload,
        callback,
      },
    };
  },
  [types.RELOADING]: (state, {payload}) => {
    return {
      ...state,
      core: {
        ...state.core,
        reloading: payload,
      },
    };
  },
  [types.REMOVE]: (state, {payload}) => {
    return {
      ...state,
      core: {
        ...state.core,
        entries: {
          files: findAndRemove(state.core.entries.files, payload),
          dirs: findAndRemove(state.core.entries.dirs, payload),
        },
      },
    };
  },
  [types.SET_VIEWMODE]: (state, {payload}) => {
    return {
      ...state,
      core: {
        ...state.core,
        viewmode: payload,
      },
    };
  },
  [types.SET_QUERY]: (state, {payload}) => {
    return {
      ...state,
      core: {
        ...state.core,
        search: {
          ...state.core.search,
          query: payload,
        },
        resetDirectoryTree: true,
      },
    };
  },
  [types.SET_SORT]: (state, {payload}) => {
    return {
      ...state,
      core: {
        ...state.core,
        search: {
          ...state.core.search,
          sort: payload,
        },
        resetDirectoryTree: true,
      },
    };
  },
  [types.SET_SORT_BY]: (state, {payload}) => {
    return {
      ...state,
      core: {
        ...state.core,
        search: {
          ...state.core.search,
          sortBy: payload,
        },
        resetDirectoryTree: true,
      },
    };
  },
  [types.SET_TYPE_FILTER]: (state, {payload}) => {
    return {
      ...state,
      core: {
        ...state.core,
        type: payload,
      },
    };
  },
  [types.ADD_FILTER]: (state, {payload}) => {
    return {
      ...state,
      core: {
        ...state.core,
        filters: {
          ...state.core.filters,
          ...payload,
        },
      },
    };
  },
  [types.INJECT_SIDE_PANEL]: (state, {payload}) => {
    return {
      ...state,
      core: {
        ...state.core,
        sidebar_components: {
          ...state.core.sidebar_components,
          ...payload,
        },
      },
    };
  },
  [types.REMOVE_SIDE_PANEL]: (state, {payload}) => {
    const sidebar_components = state.core.sidebar_components;
    if (sidebar_components[payload]) {
      delete sidebar_components[payload];
    }

    return {
      ...state,
      core: {
        ...state.core,
        sidebar_components: {},
      },
    };
  },
  [types.INJECT_MODAL]: (state, {payload}) => {
    return {
      ...state,
      core: {
        ...state.core,
        modal: payload,
      },
    };
  },
  [types.REMOVE_MODAL]: (state) => {
    return {
      ...state,
      core: {
        ...state.core,
        modal: null,
      },
    };
  },
  [types.INJECT_COMPONENT]: (state, {payload}) => {
    return {
      ...state,
      core: {
        ...state.core,
        injected_component: payload,
      },
    };
  },
  [types.REMOVE_INJECTED_COMPONENT]: (state) => {
    return {
      ...state,
      core: {
        ...state.core,
        injected_component: null,
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
  return list.filter(_item => item.id !== _item.id);
}
