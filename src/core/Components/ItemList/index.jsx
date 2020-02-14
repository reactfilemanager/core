/** @jsx jsx */
import {jsx, Text, Grid, Checkbox, Label, Flex, Spinner} from 'theme-ui';
import React, {Component} from 'react';
import styled from '@emotion/styled';
import {
  resetDirectoryTree,
  setEntries,
  setReloading,
  setShouldReload,
  setWorkingPath,
} from '../../state/actions';
import Item from './Item';
import {getApi} from '../../tools/config';
import cloneDeep from 'lodash.clonedeep';
import {ContextMenuTrigger} from 'react-contextmenu';
import {CONTEXT_MENU_ID} from '../ContextMenu';
import {toast} from 'react-toastify';
import {getSelectedItems} from '../../models/FileInfo';
import debounce from 'lodash.debounce';

class ItemList extends Component {

  state = {max: 20, total: 0};
  max = 20;
  increment = 10;

  componentDidMount() {
    this.setWorkingPath('/');
    this.getMain().addEventListener('scroll', this.infiniteLoader);
  }

  componentWillUnmount() {
    this.getMain().removeEventListener('scroll', this.infiniteLoader);
  }

  getMain = () => {
    const main = this.refs.bottom.parentElement.parentElement;
    if (main.tagName !== 'MAIN') {
      throw new Error('Container could not be detected');
    }
    return main;
  };

  infiniteLoader = debounce(e => {
    const offsetTop = this.refs.bottom.getBoundingClientRect().top;
    const clientHeight = this.getMain().clientHeight;
    if (offsetTop - 100 > clientHeight) {
      return;
    }

    if (this.state.max < this.state.total) {
      let max = this.state.max + this.increment;
      if (max > this.state.total) {
        max = this.state.total;
      }
      this.setState({max});
    }
  }, 100);

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.state.shouldReload) {
      const callback = this.props.state.callback;
      this.props.dispatch(setShouldReload(false));

      this.readPath(callback);
    }
  }

  setWorkingPath = (path) => {
    this.props.dispatch(setWorkingPath(path));
  };

  readPath = (callback) => {
    this.props.dispatch(setReloading(true));
    getApi().list(this.props.state.path).then(response => {
      if (callback) {
        response = callback(response);
      }
      const total = response.dirs.length + response.files.length;
      if (total > this.max) {
        this.setState({max: this.max, total});
      }
      this.props.dispatch(setEntries(response));
      this.props.dispatch(resetDirectoryTree(true));
    }).catch(error => {
      console.log(error);
      toast.error(error.message);
    }).finally(() => {
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
      return (
          <Flex sx={{
            height: '70vh',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {
              this.props.state.reloading ?
                  <Spinner/> :
                  <Text>No entry in this directory</Text>}
          </Flex>
      );
    }

    return (<div>
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
    </div>);
  };

  handleOnChange = e => {
    const checked = e.target.checked;
    this.markAll(checked);
  };

  markAll = checked => {
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
    const allChecked = items.length &&
        _items.find(item => item.selected === false) === undefined;
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
    let entries = cloneDeep(this.props.state.entries);
    entries = Object.values(this.props.state.filters).reduce((entries, fn) => {
      return fn(entries);
    }, entries);
    const maxDirs = entries.dirs.length <= this.state.max ? entries.dirs.length : this.state.max;
    let maxFiles = this.state.max - maxDirs;
    if(maxFiles < 0) {
      maxFiles = 0;
    }
    entries = {
      dirs: entries.dirs.slice(0, maxDirs),
      files: entries.files.slice(0, maxFiles),
    };
    return entries;
  };

  handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
    this.markAll(false);
  };

  getSelectedItems = () => {
    return getSelectedItems(this.props.state.entries);
  };

  handleContextMenu = e => {
    this.markAll(false);
  };

  getAttributes = () => {
    return {
      className: 'files-container',
      style: {padding: '16px', userSelect: 'none'},
      onClick: this.handleClick,
      onContextMenu: this.handleContextMenu,
      id: 'fm-content-holder',
    };
  };

  collect = () => {
    return {
      item: {
        path: this.props.state.path,
        isCurrentDir: true,
      },
    };
  };

  render() {
    const items = this.getItems();

    return (
        <ContextMenuTrigger
            ref="root"
            key={this.props.state.path}
            id={CONTEXT_MENU_ID}
            holdToDisplay={1000}
            name={this.props.state.path}
            collect={this.collect}
            attributes={this.getAttributes()}
            renderTag="div"
        >
          {this.props.state.viewmode === 'grid'
              ? this.getItemsBlockForGridViewMode(items)
              : this.getItemsBlockForListViewMode(items)
          }
          <div ref="bottom"/>
        </ContextMenuTrigger>
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
  tr:hover td{ background: #e7e7ff;}
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