import Rename from '../Components/Toolbar/Rename';
import Select from '../Components/Toolbar/Select';
import Delete from '../Components/Toolbar/Delete';
import MakeNew from '../Components/Toolbar/MakeNew';
import Refresh from '../Components/Toolbar/Refresh';
import Uploader from '../Components/Toolbar/Uploader';
import ViewMode from '../Components/Toolbar/ViewMode';
import Search from '../Components/Toolbar/Search';
import FilterByType from '../Components/Toolbar/FilterByType';

import context_menu from './context_menu';
import handlers from './handlers';

let _api = {};
const _defaultConfig = {
  toolbar: {
    uploader_op: Uploader,
    make_new: MakeNew,
    rename_op: Rename,
    select_op: Select,
    delete_op: Delete,
    refresh_op: Refresh,
    viewmode: ViewMode,
    filter_by_type: FilterByType,
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
    _config[key] = Object.assign({}, _config[key] || {}, injection[key]);
  }
};

export const getContextMenu = item => {
  const _menu_items = Object.assign({}, _defaultConfig.context_menu, _config.context_menu || {});
  const menu_items = {};

  for (const key of Object.keys(_menu_items)) {
    if (_menu_items[key].shouldShow(item)) {
      menu_items[key] = _menu_items[key];
    }
  }

  return menu_items;
};

export const getHandlers = item => {
  const handlers = {};
  const _handlers = Object.assign({}, _defaultConfig.handlers, _config.handlers || {});
  for (const key of Object.keys(_handlers)) {
    if (_handlers[key].handles(item)) {
      handlers[key] = _handlers[key];
    }
  }
  return handlers;
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
