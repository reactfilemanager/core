import React, {Component} from 'react';
import {Label, Spinner} from 'theme-ui';
import Tree, {TreeNode} from 'rc-tree';
import {getCurrentDirs, getDirectoryTreeState} from '../../state/actions';
import {getApi} from '../../tools/config';
import icons from '../../../assets/icons';
import './style.scss';
import cloneDeep from 'lodash.clonedeep';
import {EventBus} from '../../../helpers/Utils';
import {
  ADD_FILTER,
  DIRS_LOADED,
  FORCE_RENDER,
  GET_DIRECTORY_TREE_STATE,
  REMOVE_FILTER, RESET_DIRECTORY_TREE,
} from '../../state/types';

const getSvgIcon = (item) => {
  if (item.loaded && item.children.length === 0) {
    return '';
  }
  return item.expanded ? icons.triangle_down : icons.triangle_right;
};

class SelectableDirectoryTree extends Component {
  state = {
    dirs: [],
    filters: {},
    path: '',
    expandedKeys: [],
    working: false,
  };

  componentDidMount() {
    EventBus.$on(DIRS_LOADED, this.resetDirectoryTree);
    EventBus.$on(ADD_FILTER, this.addFilter);
    EventBus.$on(REMOVE_FILTER, this.removeFilter);
    EventBus.$on(GET_DIRECTORY_TREE_STATE, this.sendTreeState);
    EventBus.$on(RESET_DIRECTORY_TREE, this.removeFromTree);
    EventBus.$on(FORCE_RENDER, this.forceRender);

    this.addSortByName();

    this.preload();
  }

  componentWillUnmount() {
    EventBus.$off(DIRS_LOADED, this.resetDirectoryTree);
    EventBus.$off(ADD_FILTER, this.addFilter);
    EventBus.$off(REMOVE_FILTER, this.removeFilter);
    EventBus.$off(GET_DIRECTORY_TREE_STATE, this.sendTreeState);
    EventBus.$off(RESET_DIRECTORY_TREE, this.removeFromTree);
    EventBus.$off(FORCE_RENDER, this.forceRender);
  }

  removeFromTree = item => {
    getCurrentDirs().then(({path, dirs}) => {
      this.resetDirectoryTree({path, dirs});
      this.setOpenDirs();
    });
  };

  addSortByName = () => {
    this.setState({
      filters: {
        ...this.state.filters,
        tree_sort_by_name: this.sortByName,
      },
    });
  };

  sortByName = entries => {
    entries.dirs = entries.dirs.sort((dir1, dir2) => {
      if (dir1.name > dir2.name) {
        return 1;
      }
      if (dir1.name < dir2.name) {
        return -1;
      }
      return 0;
    });

    return entries;
  };

  forceRender = () => this.forceUpdate();

  sendTreeState = callback => {
    if (!this.props.preload && typeof callback === 'function') {
      callback({path: this.props.path, dirs: this.state.dirs});
    }
  };

  addFilter = (_filters) => {
    let {filters} = this.state;
    filters = {...filters, ..._filters};
    delete filters.search;

    this.setState({filters});
  };

  removeFilter = (id) => {
    const {filters} = this.state;
    if (filters[id]) {
      delete filters[id];
      this.setState({filters});
    }
  };

  preload = () => {
    if (!this.props.preload) {
      return;
    }

    getDirectoryTreeState().then(({path, dirs}) => {
      this.setState({path, dirs});
    });
  };

  resetDirectoryTree = ({path, dirs}) => {
    this.populateDirs(dirs);
  };

  populateDirs = (currentDirs) => {
    if (this.props.path === null) {
      return;
    }

    let path = this.props.path;
    let _path = path;
    if (_path === '') {
      _path = '/';
    }
    path = path.split('/');

    const _dirs = this.state.dirs;
    const dirs = this.loopDir(_dirs, path, '', _path, currentDirs);

    this.setState({dirs});
  };

  setOpenDirs = () => {
    if (this.props.path === null) {
      return;
    }
    let expandedKeys = [];

    const path = this.props.path.split('/');
    let __dir = '';
    for (const _dir of path) {
      if (__dir === '/') {
        __dir = '';
      }
      __dir += `/${_dir}`;
      if (this.state.expandedKeys.indexOf(__dir) < 0) {
        expandedKeys.push(__dir);
      }
    }

    expandedKeys = [...this.state.expandedKeys, ...expandedKeys];
    this.setState({expandedKeys});
  };

  /**
   *
   * @param dirs - current directories in tree
   * @param path - the path array
   * @param _path - upper directory
   * @param _path_ - current directory
   * @param _dirs_ - new dirs
   * @returns {*[]|*}
   */
  loopDir = (dirs, path, _path = '', _path_, _dirs_) => {
    // get next segment
    const dir = path.shift();

    // dir ended
    if (dir === undefined) {
      return [];
    }

    // append and clean up the path
    _path += '/' + dir;
    _path = _path.replace(/\/\//, '/');

    // let's find existing dir
    let _dir = dirs.find(_dir => _dir.path === _path);
    if (!_dir) {
      // not found? add it
      _dir = {
        name: dir === '' ? 'My Drive' : dir,
        path: _path,
        key: _path,
        loaded: false,
        children: [],
      };
      dirs.push(_dir);
    }

    // check if we hit the end
    if (_path_ === _path) {
      const _children = cloneDeep(_dir.children) || [];
      _dir.children = _dirs_.map(dir => {
        dir.key = dir.path;
        dir.isLeaf = false;
        dir.children = [];
        return dir;
      });

      // merge children
      for (const child of _children) {
        const exists = _dir.children.find(_child => _child.path === child.path);
        if (exists) {
          exists.children = child.children || [];
        }
      }
    }
    else {
      // we didn't hit the end yet, add children
      _dir.children = this.loopDir(_dir.children || [], path, _path, _path_, _dirs_);
    }

    return dirs;
  };

  onSelect = (info) => {
    this.props.onSelect && this.props.onSelect(info);
  };

  onLoadData = (treeNode) => {
    this.setState({working: true});
    if (Array.isArray(treeNode.props.children) && treeNode.props.children.length > 0 && treeNode.props.loaded) {
      // we loaded this before
      return new Promise((resolve) => {
        resolve();
        this.setState({working: false});
      });
    }

    return new Promise((resolve, reject) => {
      getApi().list(treeNode.props.path).then(({dirs}) => {
        let path = treeNode.props.path;
        let _path = path;
        if (_path === '') {
          _path = '/';
        }
        path = path.split('/');
        dirs = this.loopDir(this.state.dirs, path, '', _path, dirs);

        // setTimeout(() => resolve(), 3000);
        resolve();
        this.setState({dirs});
      }).catch(error => {
        console.log(error);
        reject();
      }).finally(() => {
        this.setState({working: false});
      });
    });
  };

  sendIcon = props => {
    return props.loading ? <Spinner />
      : (props.path === '/' ? icons.home : (props.expanded ? icons.folder_open : icons.folder));
  };

  handleExpand = expandedKeys => {
    const removed = this.state.expandedKeys.diff(expandedKeys);
    if (removed.length) {
      expandedKeys = expandedKeys.filter(key => !key.startsWith(removed[0]));
    }
    this.setState({expandedKeys});
  };

  getSortedDirs = (dirs = cloneDeep(this.state.dirs)) => {
    return dirs.map(dir => {
      if (dir.children && dir.children.length) {
        dir.children = this._getSortedDirs(dir.children);
      }
      return dir;
    });
  };

  _getSortedDirs = (dirs) => {
    return Object.values(this.state.filters).reduce((entries, fn) => {
      return fn(entries);
    }, {files: [], dirs}).dirs;
  };

  render() {
    const _path = this.props.path;
    const path = _path === '' ? '/' : _path;
    const loop = (data) => {
      return data.map((item) => {
        if (item.children) {
          return <TreeNode title={item.name}
                           key={item.key}
                           path={item.path}
                           expanded={path.includes(item.path)}
          >
            {loop(item.children)}
          </TreeNode>;
        }
        return (
          <TreeNode title={item.name}
                    key={item.key}
                    path={item.path}
                    expanded={path.includes(item.path)}
          />
        );
      });
    };
    const sortedDirs = this.getSortedDirs();
    const _dirs = loop(sortedDirs);

    return (
      <>
        <h4 id="folders-heading" className="heading-title" style={{padding: '10px 20px', marginBottom: '10px'}}>
          Folders
        </h4>
        <Tree
          loadData={this.onLoadData}
          onSelect={this.onSelect}
          checkable={false}
          selectedKeys={[path]}
          defaultExpandedKeys={['/']}
          expandedKeys={this.state.expandedKeys}
          onExpand={this.handleExpand}
          icon={this.sendIcon}
          switcherIcon={getSvgIcon}
          autoExpandParent
          showLine
        >
          {_dirs}
        </Tree>
      </>
    );
  }
}

export default SelectableDirectoryTree;
