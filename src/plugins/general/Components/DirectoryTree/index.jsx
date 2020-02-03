import React, {Component} from 'react';
import { Label, Spinner } from 'theme-ui'
import Tree, {TreeNode} from 'rc-tree';
import {resetDirectoryTree, setWorkingPath} from '../../state/actions';
import {getApi} from '../../tools/config';
import icons from '../../../../assets/icons';
import './style.scss'

const arrowPath = 'M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88' +
  '.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.' +
  '6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-0.7 5.' +
  '2-2L869 536.2c14.7-12.8 14.7-35.6 0-48.4z';

const getSvgIcon = (path, iStyle = {}, style = {}) => {
  return (
    <i style={iStyle}>
      <svg
        viewBox="0 0 1024 1024"
        width="1em"
        height="1em"
        fill="currentColor"
        style={{ verticalAlign: '-.125em', ...style }}
      >
        <path d={path} />
      </svg>
    </i>
  );
}
class DirectoryTree extends Component {
  state = {
    dirs: [],
    path: null,
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.state.resetDirectoryTree) {
      this.populateDirs();
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
    const dirs = this.loopDir(_dirs, path, '', _path, this.props.state.entries.dirs);

    this.setState({dirs});
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
      _dir.children = this.loopDir(_dir.children || [], path, _path, _path_, _dirs_);
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
    if (Array.isArray(treeNode.props.children) && treeNode.props.children.length > 0) {
      // we loaded this before
      return new Promise((resolve) => resolve());
    }

    return new Promise((resolve, reject) => {
      getApi()
          .list(treeNode.props.path)
          .then(({dirs}) => {
            let path = treeNode.props.path;
            let _path = path;
            if (_path === '') {
              _path = '/';
            }
            path = path.split('/');
            dirs = this.loopDir(this.state.dirs, path, '', _path, dirs);

            this.setState({dirs});
            resolve();
          })
          .catch(error => {
            console.log(error);
            reject();
          });
    });
  };

  sendIcon = props => {
    return props.loading ? <Spinner/> : icons.folder ;
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
          >
            {loop(item.children)}
          </TreeNode>;
        }
        return (
            <TreeNode title={item.name}
                      key={item.key}
                      path={item.path}
            />
        );
      });
    };

    const _dirs = loop(this.state.dirs);
    
    const switcherIcon = (obj) => {
      return getSvgIcon(arrowPath,
        { cursor: 'pointer', backgroundColor: '#eee' },
        { transform: `rotate(${obj.expanded ? 90 : 0}deg)` });
    };
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
              icon={this.sendIcon}
              switcherIcon={switcherIcon}
              showLine
          >
            {_dirs}
          </Tree>
        </>
    );
  }
}

export default DirectoryTree;
