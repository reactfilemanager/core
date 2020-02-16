import React, {Component} from 'react';
import {setWorkingPath} from '../../state/actions';
import SelectableDirectoryTree from './SelectableDirectoryTree';
import {EventBus} from '../../../helpers/Utils';
import {SET_WORKING_PATH} from '../../state/types';

class DirectoryTree extends Component {

  state = {path: ''};

  componentDidMount() {
    EventBus.$on(SET_WORKING_PATH, this.setWorkingPath);
  }

  componentWillUnmount() {
    EventBus.$off(SET_WORKING_PATH, this.setWorkingPath);
  }

  setWorkingPath = path => {
    this.setState({path});
  };

  onSelect = (info) => {
    if (!info.length) {
      return;
    }
    const path = info[0];
    // select event, set path
    setWorkingPath(path);
    this.setState({path});
  };

  render() {
    return <SelectableDirectoryTree onSelect={this.onSelect} path={this.state.path}/>;
  }
}

export default DirectoryTree;
