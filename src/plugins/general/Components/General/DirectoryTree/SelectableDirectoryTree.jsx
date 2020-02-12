import React, {Component} from 'react';
import {Label, Spinner} from 'theme-ui';
import Tree, {TreeNode} from 'rc-tree';
import {resetDirectoryTree, setWorkingPath} from '../../../state/actions';
import {getApi} from '../../../tools/config';
import icons from '../../../../../assets/icons';
import './style.scss';
import cloneDeep from 'lodash.clonedeep';

const getSvgIcon = (item) => {
  if (item.loaded && item.children.length === 0) {
    return '';
  }
  return item.expanded ? icons.triangle_down : icons.triangle_right;
};

class SelectableDirectoryTree extends Component {
  state = {
    dirs: [],
    path: null,
    expandedKeys: [],
  };

  componentDidMount() {
    this.populateDirs();
    this.setOpenDirs();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.state.resetDirectoryTree) {
      this.populateDirs();
      this.setOpenDirs();
    }
  }

  populateDirs = () => {
    if (this.props.path === null) {
      return;
    }
    this.props.dispatch(resetDirectoryTree(false));
    let path = this.props.path;
    let _path = path;
    if (_path === '') {
      _path = '/';
    }
    path = path.split('/');

    const _dirs = this.state.dirs;
    const dirs = this.loopDir(_dirs, path, '', _path,
        this.props.state.entries.dirs);

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
        name: dir === '' ? '/' : dir,
        path: _path,
        key: _path,
        loaded: false,
        children: [],
      };
      dirs.push(_dir);
    }

    // check if we hit the end
    if (_path_ === _path) {
      const _children = _dir.children || [];

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
      _dir.children = this.loopDir(_dir.children || [], path, _path, _path_,
          _dirs_);
    }

    return dirs;
  };

  onSelect = (info) => {
    this.props.onSelect && this.props.onSelect(info);
  };

  onLoadData = (treeNode) => {
    if (Array.isArray(treeNode.props.children) &&
        treeNode.props.children.length > 0) {
      // we loaded this before
      return new Promise((resolve) => resolve());
    }

    return new Promise((resolve, reject) => {
      getApi().list(treeNode.props.path).then(({dirs}) => {
        let path = treeNode.props.path;
        this.resetDirs(path, this.state.dirs);
        resolve();
      }).catch(error => {
        console.log(error);
        reject();
      });
    });
  };

  resetDirs = (_path, dirs) => {
    if (_path === '') {
      _path = '/';
    }
    const path = path.split('/');
    dirs = this.loopDir(this.state.dirs, path, '', _path, dirs);
    this.setState({dirs});
  };

  sendIcon = props => {
    return props.loading ? <Spinner/>
        : (props.expanded ? icons.folder_open : icons.folder);
  };

  handleExpand = expandedKeys => {
    const removed = this.state.expandedKeys.diff(expandedKeys);
    if (removed.length) {
      expandedKeys = expandedKeys.filter(key => !key.startsWith(removed[0]));
    }
    this.setState({expandedKeys});
  };

  getSortedDirs = (dirs = cloneDeep(this.state.dirs)) => {
    return Object.values(this.props.state.filters).reduce((entries, fn) => {
      return fn(entries);
    }, {files: [], dirs}).dirs.map(dir => {
      if (dir.children && dir.children.length) {
        dir.children = this.getSortedDirs(dir.children);
      }
      return dir;
    });
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
          <Label sx={{
            px: 3,
            py: 3,
            paddingBottom: 2,
            textTransform: 'uppercase',
            fontWeight: 'heading',
            fontSize: 11,
          }}>Folders</Label>
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