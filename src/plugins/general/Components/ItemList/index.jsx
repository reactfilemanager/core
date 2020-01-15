import React, {Component} from 'react';
import {getApi} from '../../api/GeneralAPI';
import {setEntries, setWorkingPath} from '../../state/actions';
import Item from '../Item';

class ItemList extends Component {

  componentDidMount() {
    this.setWorkingPath('/');
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.state.path !== this.props.state.path) {
      this.readPath();
    }
  }

  setWorkingPath = (path) => {
    this.props.dispatch(setWorkingPath(path));
  };

  readPath = () => {
    getApi()
        .list(this.props.state.path)
        .then(response => {
          this.props.dispatch(setEntries(response));
        })
        .catch(error => {
          console.log(error);
        });
  };

  getFileBlock = (item) => {
    return (
        <Item key={item.name} item={item} moveTo={this.setWorkingPath} dispatch={this.props.dispatch}/>
    );
  };

  render() {
    const dirs = this.props.state.entries.dirs;
    const files = this.props.state.entries.files;

    return (
        <div className="row">
          {dirs.map(dir => this.getFileBlock(dir))}
          {files.map(file => this.getFileBlock(file))}
        </div>
    );
  }
}

export default ItemList;