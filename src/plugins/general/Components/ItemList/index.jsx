import React, {Component} from 'react';
import {setEntries, setShouldReload, setWorkingPath} from '../../state/actions';
import Item from '../Item';
import {getApi} from '../../config';

class ItemList extends Component {

  componentDidMount() {
    this.setWorkingPath('/');
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.state.shouldReload) {
      this.props.dispatch(setShouldReload(false));
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

  getItemBlock = (item) => {
    return (
        <Item key={item.name} item={item} moveTo={this.setWorkingPath} dispatch={this.props.dispatch}/>
    );
  };

  render() {
    const dirs = this.props.state.entries.dirs;
    const files = this.props.state.entries.files;

    return (
        <div className="row">
          {dirs.map(dir => this.getItemBlock(dir))}
          {files.map(file => this.getItemBlock(file))}
        </div>
    );
  }
}

export default ItemList;