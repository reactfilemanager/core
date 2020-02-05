/** @jsx jsx */
import {jsx, Text, Grid, Checkbox, Label} from 'theme-ui';
import React, {Component} from 'react';
import styled from '@emotion/styled';
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

            <Grid
                width={[176]}
                gap={3}
                sx={{
                  '.react-contextmenu-wrapper': {
                    height: '100%',
                  },
                }}>
              {items.files.map(item => this.getItemBlock(item))}
            </Grid>
          </>)
          : null}
    </>);
  };

  handleOnChange = e => {
    const checked = e.target.checked;
    const entries = cloneDeep(this.props.state.entries);
    entries.dirs = entries.dirs.map(dir => {
      dir.selected = checked === true;
      return dir;
    });
    entries.files = entries.files.map(file => {
      file.selected = checked === true;
      return file;
    });
    this.props.dispatch(setEntries(entries));
  };

  getItemsBlockForListViewMode = items => {
    const _items = [...items.dirs, ...items.files];
    const allChecked = items.length && _items.find(item => item.selected === false) === undefined;
    return (
        <Table sx={{
          width: '100%',
          minWidth: '100%',
          borderSpacing: 0,
        }}>
          <thead>
          <tr>
            <TH width="1%">
              <Label>
                <Checkbox checked={allChecked} onChange={this.handleOnChange}/>
              </Label>
            </TH>
            <TH width="1%"/>
            <TH width="75%">Name</TH>
            <TH>Size</TH>
            <TH width="10%">Permission</TH>
            <TH width="10%">Last Modified</TH>
          </tr>
          </thead>
          <tbody>
          {_items.length
              ? _items.map(item => this.getItemBlock(item))
              : <tr>
                <td colSpan={6} sx={{textAlign: 'center'}}>Empty</td>
              </tr>
          }
          </tbody>
        </Table>
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

const Table = styled.table`
  border: 1px solid #dcdcdc;
  //Row
  tr:nth-of-type(odd) td{ background: #fff }
  tr:nth-of-type(even) td{ background: #f5f4f4 }
  // Hover
  tr:hover td{ background: #fafbfb;}
`;

const TH = styled.th`
  border-bottom: 1px solid #dcdcdc;
  z-index: 1;
  padding: 8px;
  white-space: nowrap;
  background: #fbfafa;
  font-size: 11px;
  text-align: left;
  font-weight: 500;
  text-transform: uppercase;
`;