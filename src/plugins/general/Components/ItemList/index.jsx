import React, {Component} from 'react';
import toastr from 'toastr';
import {resetDirectoryTree, setEntries, setReloading, setShouldReload, setWorkingPath} from '../../state/actions';
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
    this.props.dispatch(setReloading(true));
    getApi()
        .list(this.props.state.path)
        .then(response => {
          this.props.dispatch(setEntries(response));
          this.props.dispatch(resetDirectoryTree(true));
        })
        .catch(error => {
          console.log(error);
          toastr.error(error.message);
        })
        .finally(() => {
          this.props.dispatch(setReloading(false));
        });
  };

  getItemBlock = (item) => {
    return (
        <Item key={item.name} item={item} state={this.props.state} moveTo={this.setWorkingPath}
              dispatch={this.props.dispatch}/>
    );
  };

  render() {
    const items = [...this.props.state.entries.dirs, ...this.props.state.entries.files];

    return (
        <div className="row">
          {items.map(item => this.getItemBlock(item))}
        </div>
    );
  }
}

export default ItemList;