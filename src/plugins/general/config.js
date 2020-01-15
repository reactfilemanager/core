import Rename from './Components/Toolbar/Rename';
import Copy from './Components/Toolbar/Copy';
import Move from './Components/Toolbar/Move';
import Delete from './Components/Toolbar/Delete';
import MakeNew from './Components/Toolbar/MakeNew';

let _api = {};
const _defaultConfig = {
  toolbar: {
    make_new: MakeNew,
    rename_op: Rename,
    copy_op: Copy,
    move_op: Move,
    delete_op: Delete,
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
