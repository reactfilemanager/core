import React, {Component} from 'react';
import toastr from 'toastr';
import {resetDirectoryTree, setEntries, setReloading, setShouldReload, setWorkingPath} from '../../state/actions';
import Item from '../Item';
import {getApi} from '../../config';
import {cloneDeep} from 'lodash';
import ContextMenu from '../ContextMenu';

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

  getItems = () => {
    const entries = cloneDeep(this.props.state.entries);
    const items = Object.values(this.props.state.filters).reduce((entries, fn) => {
      return fn(entries);
    }, entries);

    return [...items.dirs, ...items.files];
  };

  render() {
    const items = this.getItems();

    return (
        <div className="row">
          {this.props.state.viewmode === 'grid'
              ? items.map(item => this.getItemBlock(item))
              : (
                  <table>
                    <tbody>
                    {items.map(item => this.getItemBlock(item))}
                    </tbody>
                  </table>
              )
          }
          <ContextMenu/>
        </div>
    );
  }
}

export default ItemList;