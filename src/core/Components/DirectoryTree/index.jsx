import React, {Component} from 'react';
import {setWorkingPath} from '../../state/actions';
import SelectableDirectoryTree from './SelectableDirectoryTree';

class DirectoryTree extends Component {

  onSelect = (info) => {
    if (!info.length) {
      return;
    }
    // select event, set path
    setWorkingPath(info[0]);
  };

  render() {
    return <SelectableDirectoryTree onSelect={this.onSelect}/>;
  }
}

export default DirectoryTree;
