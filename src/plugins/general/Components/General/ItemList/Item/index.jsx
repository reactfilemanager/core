/** @jsx jsx */
import {jsx, Card, Text, Image, Link, Flex, Checkbox, Label} from 'theme-ui';
import {Component} from 'react';
import styled from '@emotion/styled';
import {setEntries} from '../../../../state/actions';
import {ContextMenuTrigger} from 'react-contextmenu';
import {CONTEXT_MENU_ID} from '../../../ContextMenu';
import cloneDeep from 'lodash.clonedeep';
import {getDefaultHandler, getHandlers} from '../../../../tools/config';
import {toast} from 'react-toastify';
import {getSelectedItems} from '../../../../models/FileInfo';

class Item extends Component {

  moveTo = (item) => {
    if (item.is_dir) {
      const path = item.path.replace(/\/$/, '');
      this.props.moveTo(path);
    }
  };

  handleDoubleClick = e => {
    e.preventDefault();
    e.stopPropagation();

    if (this.props.item.is_dir) {
      return this.moveTo(this.props.item);
    }

    const handlers = getDefaultHandler(this.props.item, this.props.state);
    if (!handlers) {
      toast.info('Unsupported file type.');
      return;
    }
    handlers.handle(this.props.item, this.props.state, this.props.dispatch);
  };

  toggleSelect = (ctrlKey, shiftKey) => {

    let shouldMark = false;
    const lastSelectedItem = this.findLastSelected();
    if (shiftKey && lastSelectedItem) {
      const self = this;

      function mark(item) {
        let skip = false;
        if (!shouldMark && (item.id === lastSelectedItem.id || item.id ===
            self.props.item.id)) {
          // marking start
          shouldMark = true;
          skip = true;
        }

        if (shouldMark) {
          item.selected = true;
          item.selection_time = new Date();
        }
        else {
          item.selected = false;
          item.selection_time = null;
        }

        if (!skip && shouldMark &&
            (item.id === lastSelectedItem.id || item.id ===
                self.props.item.id)) {
          // marking end
          shouldMark = false;
        }
        return item;
      }

      const entries = cloneDeep(this.props.state.entries);
      const items = Object.values(this.props.state.filters).
          reduce((entries, fn) => {
            return fn(entries);
          }, entries);

      const dirs = items.dirs.map(dir => mark(dir));
      const files = items.files.map(file => mark(file));

      this.props.dispatch(setEntries({dirs, files}));
    }
    else {
      const dirs = this.props.state.entries.dirs.map(
          dir => this.markItemSelected(dir, ctrlKey, shiftKey));
      const files = this.props.state.entries.files.map(
          file => this.markItemSelected(file, ctrlKey, shiftKey));
      this.props.dispatch(setEntries({dirs, files}));
    }
  };

  handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.toggleSelect(e.ctrlKey || e.metaKey, e.shiftKey);
  };

  toggleCheck = e => {
    e.preventDefault();
    e.stopPropagation();

    this.toggleSelect(true, false);
  };

  getSelectedItems = () => {
    return getSelectedItems(this.props.state.entries);
  };

  findLastSelected = () => {
    const items = this.getSelectedItems().
        sort((a, b) => a.selection_time < b.selection_time ? 1 : -1);
    if (items.length) {
      return items.shift();
    }
    return null;
  };

  markItemSelected = (item, ctrlKey) => {
    item.selection_time = null;
    if (!ctrlKey) {
      item.selected = false;
    }

    if (this.props.item.id === item.id) {
      item.selected = !item.selected;
      item.selection_time = new Date();
    }
    return item;
  };

  handleContextMenu = e => {
    if (!this.props.item.selected || this.getSelectedItems().length < 2) {
      this.handleClick(e);
    }
  };

  collect = () => {
    return {
      item: this.props.item,
    };
  };

  get title() {
    const item = this.props.item;
    const parts = [
      item.name,
      item.size.toHumanFileSize(),
      item.perms,
    ];

    return parts.join('\n');
  }

  getAttributes = (item) => {
    return {
      onContextMenu: this.handleContextMenu,
      className: item.selected ? 'selected' : '',
    };
  };

  get className() {
    const className = ['fm-item'];
    if (this.props.item.selected) {
      className.push('fm-item-selected');
    }
    return className.join(' ');
  }

  getGridItem = (item) => {
    return (
        <Card className={this.className}
              onDoubleClick={this.handleDoubleClick}
              onClick={this.handleClick}>
          <ContextMenuTrigger
              key={item.id}
              id={CONTEXT_MENU_ID}
              holdToDisplay={1000}
              name={item.name}
              collect={this.collect}
              attributes={this.getAttributes(item)}
              style={{height: '100%'}}
          >
            {
              item.is_dir ?
                  <div
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}>
                    <Image src={thumb(item.path)} sx={{
                      width: 32,
                      maxWidth: 32,
                      mr: 2,
                    }}/>
                    <Text sx={{
                      paddingTop: '4px',
                      paddingRight: 2,
                      fontSize: 12,
                      fontWeight: 'bold',
                      color: 'gray',
                      width: 'calc(100% - 28px)',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}>{item.name} {item.components}</Text>
                  </div> :
                  <Flex sx={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '100%',
                  }}>
                    <div sx={{
                      position: 'relative',
                      width: '100%',
                      height: '140px',
                      overflow: 'hidden',
                    }}>
                      <div sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Image src={thumb(item.path)}/>
                      </div>
                    </div>
                    <Text sx={{
                      width: '100%',
                      borderTop: '1px solid #eee',
                      paddingTop: '4px',
                      marginTop: 2,
                      textAlign: 'center',
                      fontSize: 12,
                      color: 'gray',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <span sx={{
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                      }}>{item.basename}</span>
                      <span>{item.getExtension(true)}</span>
                      {item.components}
                    </Text>
                  </Flex>
            }


          </ContextMenuTrigger>
        </Card>
    );
  };

  getListItem = (item) => {
    return (
        <ContextMenuTrigger
            key={item.id}
            id={CONTEXT_MENU_ID}
            holdToDisplay={1000}
            name={item.name}
            collect={this.collect}
            attributes={this.getAttributes(item)}
            renderTag="tr"
        >
          <TD onClick={this.toggleCheck}>
            <Label>
              <Checkbox checked={item.selected} onChange={e => e}/>
            </Label>
          </TD>
          <TD><Image src={thumb(item.path)}
                     sx={{maxWidth: '20px', maxHeight: '20px'}}/></TD>
          <TD> {
            item.is_dir ?
                <Text
                    sx={{
                      textDecoration: 'none',
                      color: 'black',
                    }}>{item.name}</Text>
                : item.name
          }
          </TD>
          <TD>
            {item.is_file ? item.size.toHumanFileSize() : ''}
          </TD>
          <TD>
            {item.perms}
          </TD>
          <TD>
            {item.last_modified.toHumanFormat()}
          </TD>
          <TD/>
        </ContextMenuTrigger>
    );
  };

  render() {
    const viewmode = this.props.state.viewmode;
    const item = this.props.item;

    if (viewmode === 'grid') {
      return this.getGridItem(item);
    }
    else if (viewmode === 'list') {
      return this.getListItem(item);
    }
    else {
      return <div>Invalid viewmode</div>;
    }
  }

}

export default Item;

const TD = styled.td`
  padding: 8px;
  white-space: nowrap;
  text-align: left;
  font-weight: 400;

  svg{
    margin-right: 0;
  }
`;