import Rename from './Components/Toolbar/Rename';
import Select from './Components/Toolbar/Select';
import Delete from './Components/Toolbar/Delete';
import MakeNew from './Components/Toolbar/MakeNew';
import Refresh from './Components/Toolbar/Refresh';
import Uploader from './Components/Toolbar/Uploader';
import ViewMode from './Components/Toolbar/ViewMode';
import Search from './Components/Toolbar/Search';

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
    search: Search,
  },
};

let _config = {};

export const getApi = () => {
  return _api;
};

export const getDefaultConfig = () => {
  return _defaultConfig;
};

export const getConfig = () => {
  return _config;
};

export default function({api, config}) {
  _api = api || {};
  _config = config || {};
}
