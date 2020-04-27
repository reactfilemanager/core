import React, {Component} from 'react';
import {setWorkingPath} from '../../state/actions';
import SelectableDirectoryTree from './SelectableDirectoryTree';

class DirectoryTree extends Component {

  onSelect = (info) => {
    if (!info.length) {
      return;
    }
    const path = info[0];
    // select event, set path
    setWorkingPath(path);
  };

  render() {
    return <SelectableDirectoryTree onSelect={this.onSelect} path=''/>;
  }
}

export default DirectoryTree;
