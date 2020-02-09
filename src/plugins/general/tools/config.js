import MakeNew from '../Components/Toolbar/MakeNew';
import Refresh from '../Components/Toolbar/Refresh';
import Uploader from '../Components/Toolbar/Uploader';
import ViewMode from '../Components/Toolbar/ViewMode';
import Search from '../Components/Toolbar/Search';
import FilterByType from '../Components/Toolbar/FilterByType';
import Delete from '../Components/Toolbar/Delete';

import context_menu from './context_menu';
import handlers from './handlers';
import CopyTo from '../Components/Toolbar/CopyTo';
import MoveTo from '../Components/Toolbar/MoveTo';

let _api = {};
const _defaultConfig = {
  toolbar: {
    uploader_op: Uploader,
    make_new: MakeNew,
    copy_op: CopyTo,
    move_op: MoveTo,
    delete_op: Delete,
    refresh_op: Refresh,
  },
  utility: {
    filter_by_type: FilterByType,
    viewmode: ViewMode,
  },
  search: {
    search: Search,
  },
  context_menu,
  handlers,
};

const _config = {};

export const getApi = () => {
  return _api;
};

export const getDefaultConfig = () => {
  return _defaultConfig;
};

export const getConfig = () => {
  return _config;
};

export const inject = injection => {
  for (const key of Object.keys(injection)) {
    if (typeof injection[key] === 'object') {
      _config[key] = {...(_config[key] || {}), ...injection[key]};
    }
    else {
      _config[key] = injection[key];
    }
  }
};

export const getContextMenu = (item, state) => {
  const _menu_items = Object.assign({}, _defaultConfig.context_menu,
      _config.context_menu || {});
  const menu_items = {};

  for (const key of Object.keys(_menu_items)) {
    if (_menu_items[key].shouldShow(item, state)) {
      menu_items[key] = _menu_items[key];
    }
  }

  return menu_items;
};

export const getHandlers = (item, state) => {
  const handlers = {};
  const _handlers = Object.assign({}, _defaultConfig.handlers,
      _config.handlers || {});
  for (const key of Object.keys(_handlers)) {
    if (_handlers[key].handles(item, state)) {
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

export const addHandlers = handlers => {
  const _handlers = _config.handlers || {};
  for (const key of Object.keys(handlers)) {
    _handlers[key] = handlers[key];
  }
  _config.handlers = _handlers;
};

export const addContextMenuItem = menuItems => {
  const menu_items = _config.context_menu || {};
  for (const key of Object.keys(menuItems)) {
    menu_items[key] = menuItems[key];
  }
  _config.context_menu = menu_items;
};

export default function({api}) {
  _api = api || {};
}
