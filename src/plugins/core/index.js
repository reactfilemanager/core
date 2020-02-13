import CoreApi from './api';
import config, {accessor} from './tools/config';
import General from './Components/General';
import reducers from './state/reducers';
import initial_state from './state';

export default {
  // hook/name for the plugin
  general: {
    // register API
    api: CoreApi,
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
    // add context menu entry
    context_menu: [],
    // add toolbar entry
    toolbar: {},
    // access to directory tree
    directory_tree: {},
    // access to info panel
    info_panel: {},
    // add reducers
    reducers,
    accessor,
  },
};
