import React, {Component} from 'react';
import Tree, {TreeNode} from 'rc-tree';
import {resetDirectoryTree, setWorkingPath} from '../../state/actions';

class DirectoryTree extends Component {
  state = {
    dirs: [],
    path: null,
  };

  componentDidMount() {
    this.populateDirs();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.state.resetDirectoryTree) {
      this.populateDirs();
      this.props.dispatch(resetDirectoryTree(false));
    }
  }

  populateDirs = () => {
    if (!this.props.state.path) {
      return;
    }

    const path = (this.props.state.path)
        .replace(/\/$/, '')
        .split('/');

    const _dirs = [...this.state.dirs];
    const dirs = this.loopDir(_dirs, path);

    this.setState({dirs});
  };

  loopDir = (dirs, path, _path = '') => {
    const dir = path.shift();

    _path += '/' + dir;

    let _dir = dirs.find(_dir => _dir.path === _path);

    if (!_dir) {
      _dir = {
        name: dir,
        path: _path === '/' ? _path : _path.replace(/\/$/, ''),
        key: _path,
        loaded: false,
        children: [],
      };
      dirs.push(_dir);
    }

    if (_path === '/') {
      _path = '';
    }

    if (this.props.state.path === _path + '/') {
      const _children = this.props.state.entries.dirs.map(dir => {
        dir.key = dir.path;
        return dir;
      });

      _dir.children = _dir.children || [];

      for (const child of _children) {
        const exists = _dir.children.find(_child => _child.path === child.path);
        if (!exists) {
          _dir.children.push(child);
        }
        else if (!exists.loaded) {
          child.children = exists.children;
          _dir.children[_dir.children.indexOf(exists)] = child;
        }
      }
    }
    else {
      _dir.children = this.loopDir(_dir.children || [], path, _path);
    }

    return dirs;
  };

  onSelect = (info) => {
    this.props.dispatch(setWorkingPath(info + '/'));
  };

  onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
  };

  render() {
    const loop = (data) => {
      return data.map((item) => {
        if (item.children) {
          return <TreeNode title={item.name}
                           key={item.key}>
            {loop(item.children)}
          </TreeNode>;
        }
        return (
            <TreeNode title={item.name}
                      key={item.key}
                      isLeaf={item.isLeaf}
                      disabled={item.key === '0-0-0'}
            />
        );
      });
    };

    const _dirs = loop(this.state.dirs);
    return (
        <div>
          <Tree
              onSelect={this.onSelect}
              loadData={this.onLoadData}
          >
            {_dirs}
          </Tree>
        </div>
    );
  }
}

export default DirectoryTree;
