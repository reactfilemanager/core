/** @jsx jsx */
import {jsx, Card, Text, Image, Link, Flex, Checkbox, Label} from 'theme-ui';
import {Component} from 'react';
import styled from '@emotion/styled';
import {getSelectedItems, setWorkingPath, toggleSelect} from '../../../state/actions';
import {ContextMenuTrigger} from 'react-contextmenu';
import {CONTEXT_MENU_ID} from '../../ContextMenu';
import {getDefaultHandler} from '../../../tools/config';
import {toast} from 'react-toastify';
import {EventBus} from '../../../../helpers/Utils';
import {ITEMS_SELECTED, UPDATE} from '../../../state/types';

class Item extends Component {

  state = {selected: false, multipleSelected: false};

  componentDidMount() {
    getSelectedItems().then(items => {
      if (Array.isArray(items)) {
        this.onSelect(items);
      }
    });
    EventBus.$on(ITEMS_SELECTED, this.onSelect);
  }

  componentWillUnmount() {
    EventBus.$off(ITEMS_SELECTED, this.onSelect);
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.props.item.id !== nextProps.item.id || this.state.selected !== nextState.selected ||
        this.state.multipleSelected !== nextState.multipleSelected;
  }

  onSelect = items => {
    const selected = items.find(item => item.id === this.props.item.id) !== undefined;
    const multipleSelected = items.length > 1;
    this.setState({selected, multipleSelected});
  };

  moveTo = (item) => {
    if (item.is_dir) {
      const path = item.path.replace(/\/$/, '');
      this.props.moveTo(path);
      setWorkingPath(path);
    }
  };

  handleDoubleClick = e => {
    e.preventDefault();
    e.stopPropagation();

    if (this.props.item.is_dir) {
      return this.moveTo(this.props.item);
    }

    const handlers = getDefaultHandler(this.props.item);
    if (!handlers) {
      toast.info('Unsupported file type.');
      return;
    }
    handlers.handle(this.props.item);
  };

  toggleSelect = (ctrlKey, shiftKey) => {
    toggleSelect(ctrlKey, shiftKey, this.props.item.id);
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

  handleContextMenu = e => {
    if (!this.state.selected || !this.state.multipleSelected) {
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

  getAttributes = (item, withHandlers = false) => {
    let attrs = {
      onContextMenu: this.handleContextMenu,
      className: this.state.selected ? 'selected' : '',
    };

    if (withHandlers) {
      attrs = {
        ...attrs,
        onDoubleClick: this.handleDoubleClick,
        onClick: this.handleClick,
      };
    }

    return attrs;
  };

  get className() {
    const className = ['fm-item'];
    if (this.state.selected) {
      className.push('fm-item-selected');
    }
    return className.join(' ');
  }

  getGridItem = (item) => {
    return (
        <Card id={item.id}
              className={this.className}
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
            attributes={this.getAttributes(item, true)}
            renderTag="tr"
        >
          <TD onClick={this.toggleCheck}>
            <Label>
              <Checkbox checked={this.state.selected} onChange={e => e}/>
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
    const viewmode = this.props.viewmode;
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