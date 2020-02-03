import APIMapper from './mappers/APIMapper';
import merge from 'lodash.merge';
import {appendState} from './state/store/initialState';
import {addReducer} from './state/reducers';

const plugins = {};
const config = {};
const api = {};
const tabs = [];
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
      api[key] = APIMapper.mapAPIConfigToMethod(key.toProperCase(), plugin.api);
    }

    // load the boot manager
    if (plugin.boot) {
      bootRequired.push({boot: plugin.boot, key});
    }

    // injector
    if (plugin.injects) {
      inject(plugin.injects);
    }

    plugins[key] = plugin;
  }
};

const addTabs = _tabs => {
  for (const key of Object.keys(_tabs)) {
    const tab = _tabs[key];
    const existing = tabs.find(tab => tab.key === key);
    if (existing) {
      throw new Error(`${key} tab exists`);
    }

    tabs.push({
                title: tab.title,
                key,
                component: tab.component,
              });
  }
};

const inject = injects => {
  for(const key of Object.keys(injects)) {
    if(!plugins[key]) {
      console.log(`Plugin ${key} is not registered`);
      continue;
    }

    const inject = plugins[key].inject;

    if(!inject) {
      console.log(`Plugin ${key} does not have injection enabled`);
      continue;
    }

    // inject
    inject(injects[key]);
  }
};

export const getTabs = () => {
  return tabs;
};

export const bootPlugins = () => {
  for (const entry of bootRequired) {
    entry.boot({api: api[entry.key]});
  }
  bootRequired = [];
};
