import CoreAPI from './api';
import config, {accessor} from './tools/config';
import General from './Components';
import reducers from './state/reducers';
import initial_state from './state';

export const CORE_PLUGIN_KEY = 'core';

export default {
  // register API
  api: CoreAPI,
  // load time function calls
  boot: config,
  // add initial state
  initial_state,
  // add a tab entry
  tabs: {
    entries: {
      title: 'Entries',
      component: General,
    },
  },
  // add reducers
  reducers,
  accessor,
};
