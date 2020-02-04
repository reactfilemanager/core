/** @jsx jsx */
import React from 'react';
import {jsx, Text, Grid} from 'theme-ui';
import {Component} from 'react';
import toastr from 'toastr';
import {resetDirectoryTree, setEntries, setReloading, setShouldReload, setWorkingPath} from '../../state/actions';
import Item from '../Item';
import {getApi} from '../../tools/config';
import cloneDeep from 'lodash.clonedeep';

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
        <Item key={item.id} item={item} state={this.props.state}
              moveTo={this.setWorkingPath}
              dispatch={this.props.dispatch}/>
    );
  };

  getItemsBlockForGridViewMode = (items) => {
    if (items.dirs.length === 0 && items.files.length === 0) {
      return (<Text>No entry in this directory</Text>);
    }

    return (<>
      {items.dirs.length
          ? (<>
            <Text sx={{
              p: 2,
              my: 2,
              textTransform: 'uppercase',
              fontSize: 13,
              color: 'gray',
            }}>Folders</Text>

            <Grid
                columns={4}
                gap={3}
            >
              {items.dirs.map(item => this.getItemBlock(item))}
            </Grid>
          </>)
          : null}

      {items.files.length
          ? (<>      <Text sx={{
            px: 2,
            my: 3,
            textTransform: 'uppercase',
            fontSize: 13,
            color: 'gray',
          }}>Files</Text>

            <Grid width={[176]} gap={3}>{items.files.map(item => this.getItemBlock(item))}</Grid>
          </>)
          : null}
    </>);
  };

  getItemsBlockForListViewMode = items => {
    return (
        <table className="table">
          <tbody>
          {[...items.dirs, ...items.files].map(item => this.getItemBlock(item))}
          </tbody>
        </table>
    );
  };

  getItems = () => {
    const entries = cloneDeep(this.props.state.entries);
    return Object.values(this.props.state.filters).reduce((entries, fn) => {
      return fn(entries);
    }, entries);
  };

  render() {
    const items = this.getItems();

    return (
        <div className="files-container" sx={{padding: '16px'}}>
          {this.props.state.viewmode === 'grid'
              ? this.getItemsBlockForGridViewMode(items)
              : this.getItemsBlockForListViewMode(items)
          }
        </div>
    );
  }
}

export default ItemList;