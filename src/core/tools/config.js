import Refresh from '../Components/Toolbar/Refresh';
import Uploader from '../Components/Toolbar/Uploader';
import ViewMode from '../Components/Toolbar/ViewMode';
import Search from '../Components/Toolbar/Search';

import context_menu from './context_menu';
import handlers from './handlers';
import {CopyButton} from '../Components/Utilities/Copy';
import {DeleteButton} from '../Components/Utilities/Delete';
import {NewFolderButton} from '../Components/Utilities/NewFolder';

let _api = {}, _instance = null;
let _getConfig = () => {};
const _defaultConfig = {
  toolbar: {
    uploader_op: Uploader,
    new_folder: NewFolderButton,
    copy_op: CopyButton(false),
    move_op: CopyButton(true),
    delete_op: DeleteButton,
    refresh_op: Refresh,
  },
  utility: {
    viewmode: ViewMode,
  },
  search: {
    search: Search,
  },
  context_menu,
  handlers,
};

export const getApi = () => {
  return _api;
};

export const getDefaultConfig = () => {
  return _defaultConfig;
};

export const getConfig = () => {
  return _getConfig();
};

export const getContextMenu = (item, state) => {
  const _menu_items = Object.assign({}, _defaultConfig.context_menu, getConfig().context_menu || {});
  const menu_items = {};

  for (const key of Object.keys(_menu_items)) {
    if (_menu_items[key].shouldShow(item, state)) {
      menu_items[key] = _menu_items[key];
    }
  }

  return menu_items;
};

export const getDefaultHandler = (item, state) => {
  const _handlers = Object.assign({}, _defaultConfig.handlers, getConfig().handlers || {});
  if (_handlers.default && _handlers.default.handles(item, state)) {
    return _handlers.default;
  }
  else {
    const handlers = getHandlers(item, state);
    if (handlers.length > 0) {
      return handlers[0];
    }
  }
  return null;
};

export const getHandlers = (item, state) => {
  const handlers = {};
  const _handlers = Object.assign({}, _defaultConfig.handlers, getConfig().handlers || {});
  for (const key of Object.keys(_handlers)) {
    if (_handlers[key].menu_item !== undefined &&
        _handlers[key].handles(item, state)) {
      handlers[key] = _handlers[key];
    }
  }

  const handlersKeys = Object.keys(handlers);
  let handlersArray = [];
  for (const key of handlersKeys) {
    handlersArray.push({
      key,
      ...handlers[key],
    });
  }

  return handlersArray.sort((a, b) => {
    if (a.order === undefined) {
      a.order = 10;
    }
    if (b.order === undefined) {
      b.order = 10;
    }
    if (a.order > b.order) {
      return 1;
    }
    else if (a.order < b.order) {
      return -1;
    }
    else {
      return 0;
    }
  });
};

export const setAccessor = instance => {
  _instance = instance;
};

export const accessor = () => {
  return _instance;
};

export default function({api, getConfig}) {
  _api = api || {};
  _getConfig = getConfig;
}
