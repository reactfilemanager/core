import React, {Component} from 'react';
import {Label, Spinner} from 'theme-ui';
import Tree, {TreeNode} from 'rc-tree';
import {resetDirectoryTree, setWorkingPath} from '../../../state/actions';
import {getApi} from '../../../tools/config';
import icons from '../../../../../assets/icons';
import './style.scss';

const getSvgIcon = (item) => {
  if (item.loading) {
    return <Spinner/>;
  }
  return item.expanded ? icons.triangle_down : icons.triangle_right;
};

class DirectoryTree extends Component {
  state = {
    dirs: [],
    path: null,
    expandedKeys: [],
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.state.resetDirectoryTree) {
      this.populateDirs();
      this.setOpenDirs();
    }
  }

  populateDirs = () => {
    if (this.props.state.path === null) {
      return;
    }
    this.props.dispatch(resetDirectoryTree(false));
    let path = this.props.state.path;
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
    let expandedKeys = [];

    const path = this.props.state.path.split('/');
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
    if (!info.length) {
      return;
    }
    // select event, set path
    this.props.dispatch(setWorkingPath(info[0]));
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
        let _path = path;
        if (_path === '') {
          _path = '/';
        }
        path = path.split('/');
        dirs = this.loopDir(this.state.dirs, path, '', _path, dirs);

        this.setState({dirs});
        // setTimeout(() => resolve(), 15000);
        resolve();
      }).catch(error => {
        console.log(error);
        reject();
      });
    });
  };

  sendIcon = props => {
    return props.loading ? '' : icons.folder;
  };

  handleExpand = expandedKeys => {
    const removed = this.state.expandedKeys.diff(expandedKeys);
    if(removed.length) {
      expandedKeys = expandedKeys.filter(key => !key.startsWith(removed[0]));
    }
    this.setState({expandedKeys});
  };

  render() {
    const _path = this.props.state.path;
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

    const _dirs = loop(this.state.dirs);

    return (
        <>
          <Label sx={{
            px: 3,
            py: 3,
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

export default DirectoryTree;
