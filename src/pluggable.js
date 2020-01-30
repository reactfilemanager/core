import APIMapper from './mappers/APIMapper';
import {merge} from 'lodash';
import {appendState} from './state/store/initialState';
import {addReducer} from './state/reducers';

const plugins = {};
const config = {};
const api = {};
const tabs = [];
const context_menu_items = [];
let bootRequired = [];

export const registerPlugin = (_plugins) => {
  for (const key of Object.keys(_plugins)) {
    const plugin = _plugins[key];
    // load state
    if (plugin.initial_state) {
      appendState(key, plugin.initial_state);
    }

    // load tabs
    if (plugin.tabs) {
      for (const key of Object.keys(plugin.tabs)) {
        const tab = plugin.tabs[key];
        tabs
            .push({
                    title: tab.title,
                    key,
                    component: tab.component,
                  });
      }
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
      api[key] = APIMapper.mapAPIConfigToMethod(key.toProperCase(), plugin.api);
    }

    // load the context menu
    if (plugin.context_menu) {
      context_menu_items.push(...plugin.context_menu);
    }

    // load the boot manager
    if (plugin.boot) {
      bootRequired.push({boot: plugin.boot, key});

    }

    plugins[key] = plugin;
  }
};

export const getTabs = () => {
  return tabs;
};

export const getContextMenu = () => {
  return context_menu_items;
};

export const bootPlugins = () => {
  for (const entry of bootRequired) {
    entry.boot({api: api[entry.key], config: config[entry.key]});
  }
  bootRequired = [];
};
