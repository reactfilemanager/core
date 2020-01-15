import NewFile from './Components/Toolbar/NewFile';
import NewDir from './Components/Toolbar/NewDir';
import Rename from './Components/Toolbar/Rename';
import Copy from './Components/Toolbar/Copy';
import Move from './Components/Toolbar/Move';
import Delete from './Components/Toolbar/Delete';

let _api = {};
const _defaultConfig = {
  toolbar: {
    new_file: NewFile,
    new_dir: NewDir,
    rename: Rename,
    copy: Copy,
    move: Move,
    delete: Delete,
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
