import APIMapper from './mappers/APIMapper';
import merge from 'lodash.merge';
import {appendState} from './state/store/initialState';
import {addReducer} from './state/reducers';
import HttpService from './services/HttpService';

const plugins = {};
const config = {};
const api = {};
const tabs = [];
let bootRequired = [];

export const registerPlugins = (_plugins) => {
  for (const key of Object.keys(_plugins)) {
    const plugin = _plugins[key];
    registerPlugin(key, plugin);
  }
};

const registerPlugin = (key, plugin) => {
  // load state
  if (plugin.initial_state) {
    appendState(key, plugin.initial_state);
  }

  // load tabs
  if (plugin.tabs) {
    addTabs(plugin.tabs);
  }

  // load reducers
  if (plugin.reducers) {
    for (const key of Object.keys(plugin.reducers)) {
      addReducer(key, plugin.reducers[key]);
    }
  }

  // load config
  if (plugin.config) {
    for (const key of Object.keys(plugin.reducers)) {
      const prevConf = config[key] !== undefined ? config[key] : {};
      config[key] = merge(prevConf, plugin.config[key]);
    }
  }

  // load the api
  if (plugin.api) {
    api[key] = APIMapper.mapAPIConfigToMethod(key, plugin.api);
  }

  // load the boot manager
  if (plugin.boot) {
    bootRequired.push({boot: plugin.boot, key});
  }

  // injector
  if (plugin.injects) {
    injects(plugin.injects);
  }

  plugins[key] = plugin;
};

const addTabs = _tabs => {
  for (const key of Object.keys(_tabs)) {
    const tab = _tabs[key];
    addTab(key, tab);
  }
};

const addTab = (key, tab) => {
  const existing = tabs.find(tab => tab.key === key);
  if (existing) {
    throw new Error(`${key} tab exists`);
  }

  tabs.push({
    title: tab.title,
    key,
    component: tab.component,
  });
};

const injects = injects => {
  for (const key of Object.keys(injects)) {
    inject(key, injects[key]);
  }
};

const inject = (key, _config) => {
  if (!plugins[key]) {
    console.log(`Plugin ${key} is not registered`);
    return;
  }

  if (!config[key]) {
    config[key] = {};
  }

  for (const cKey of Object.keys(_config)) {
    if (typeof _config[cKey] === 'object') {
      config[key][cKey] = {...(config[key][cKey] || {}), ..._config[cKey]};
    }
    else {
      config[key][cKey] = _config[cKey];
    }
  }
};

export const getTabs = () => {
  return tabs;
};

const getConfig = key => {
  return () => {
    return config[key] ? config[key] : {};
  };
};

export const bootPlugins = () => {
  for (const entry of bootRequired) {
    entry.boot({
      api: api[entry.key],
      getConfig(key = null) {
        return getConfig(key || entry.key);
      },
      getApi(key) {
        return api[key] || null;
      },
      HttpService,
    });
  }
  bootRequired = [];
};

export const mapApi = (key, api) => {
  return APIMapper.mapAPIConfigToMethod(key, api);
};

export const addHandler = (pluginKey, key, handles, handle, menu_item = null, order = 10) => {
  addToConfig(pluginKey, 'handlers', key, {
    handles,
    handle,
    menu_item,
    order,
  });
};

export const addContextMenu = (pluginKey, key, shouldShow, handle, menu_item = null, order = 10) => {
  addToConfig(pluginKey, 'context_menu', key, {
    shouldShow,
    handle,
    menu_item,
    order,
  });
};
export const addToolbarButton = (pluginKey, key, button, order = 10) => {
  addToConfig(pluginKey, 'toolbar', key, button, order);
};

const addToConfig = (pluginKey, configKey, itemKey, item) => {
  if (!config[pluginKey]) {
    config[pluginKey] = {[configKey]: {}};
  }
  if (!config[pluginKey][configKey]) {
    config[pluginKey][configKey] = {};
  }
  config[pluginKey][configKey][itemKey] = item;
};

export const Pluggable = {
  registerPlugins,
  registerPlugin(pluginKey, plugin) {
    registerPlugin(pluginKey, plugin);
    return this.plugin(pluginKey);
  },
  addTabs,
  addTab,
  addReducer,
  mapApi,
  plugin(pluginKey) {
    if (!plugins[pluginKey]) {
      return null;
    }
    return {
      _plugin: plugins[pluginKey],
      addHandler(key, handles, handler, menuItem = null, order = 10) {
        addHandler(pluginKey, key, handles, handler, menuItem, order);
      },
      addContextMenu(key, shouldShow, handler, menuItem, order = 10) {
        addContextMenu(pluginKey, key, shouldShow, handler, menuItem, order);
      },
      addToolbarButton(key, button, order = 10) {
        addToolbarButton(pluginKey, key, button, order);
      },
      mergeConfig(_config) {
        for (const key of _config) {
          if (config[pluginKey][key]) {
            config[pluginKey][key] = {...config[pluginKey][key], ..._config[key]};
          }
          else {
            config[pluginKey][key] = _config[key];
          }
        }
      },
      inject(config) {
        inject(pluginKey, config);
      },
      accessor() {
        return this._plugin.accessor ? this._plugin.accessor() : null;
      },
    };
  },
};
