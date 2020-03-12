/** @jsx jsx*/
import {jsx, Box, Heading, Text, Close, Image } from 'theme-ui';
import React, {Component} from 'react';
import styled from '@emotion/styled';
import icons from '../../../assets/icons';
import {FILE_TYPES} from '../Toolbar/FilterByType';
import {removeSidePanel} from '../../state/actions';
import {EventBus} from '../../../helpers/Utils';

export const INFO_PANEL_SHOWN = 'INFO_PANEL_SHOWN';
export const ADD_INFO_BLOCK = 'ADD_INFO_BLOCK';

class InfoPanel extends Component {

  state = {isOpen: false, _blocks: []};
  timeout = 200;

  componentDidMount() {
    this.setState({isOpen: true});
    setTimeout(() => {
      EventBus.$on(['click', 'contextmenu'], this.closePanel)
    }, 100);
    EventBus.$on(ADD_INFO_BLOCK, this.addInfoBlock);
    EventBus.$emit(INFO_PANEL_SHOWN, this.props.item);
  }

  componentWillUnmount() {
    EventBus.$off(['click', 'contextmenu'], this.closePanel);
    EventBus.$off(ADD_INFO_BLOCK, this.addInfoBlock);
  }

  addInfoBlock = block => {
    this.setState({_blocks: [...this.state._blocks, block]})
  };

  get isImage() {
    return FILE_TYPES.image.indexOf(this.props.item.extension) >= 0;
  }

  closePanel = (e) => {
    if(this.refs.panel.isIn(e.path)) {
      return;
    }

    this._remove();
  };

  _remove = e => {
    if(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.setState({ isOpen: false });
    setTimeout(() => {
      this.componentWillUnmount();
      removeSidePanel('info');
    }, this.timeout+100);
  };

  render() {
    const item = this.props.item;
    return (
      <div ref="panel" sx={{
        position: 'absolute',
        top: '0',
        right: 0,
        zIndex: 8,
        width: '320px',
        height: '100%',
        bg: 'white',
        p: 3,
        overflow: 'auto',
        borderLeft: '1px solid #ddd',
        transition: `transform ${this.timeout}ms ease-out`,
        transform: (this.state.isOpen ? 'translateX(0)' : 'translateX(340px)')
      }}>
        <Heading as='h2' sx={{
          borderBottom: '1px solid #f1f1f1',
          paddingBottom: '10px'
        }}>{icons.info} Details</Heading>
        <Close sx={{
          position: 'absolute',
          top: 1,
          right: '10px',
          cursor: 'pointer'
        }} onClick={this._remove} />
        <div sx={{ marginTop: 4 }}>
          <Block>
            <Image src={thumb(item.path)}/>
          </Block>
          <Block>
            <Label>Name</Label>
            <Text sx={{ wordBreak: 'break-word' }}>{item.name}</Text>
          </Block>
          {this.isImage ? <>
            <Block>
              <Label>Dimension</Label>
              <Text>{`${item.image_info.width}x${item.image_info.width}`}</Text>
            </Block>
          </> : null}
          <Block>
            <Label>Size</Label>
            <Text>{item.size.toHumanFileSize()}</Text>
          </Block>
          <Block>
            <Label>Permission</Label>
            <Text>{item.perms}</Text>
          </Block>
          <Block>
            <Label>Last Modified</Label>
            <Text>{item.last_modified.toHumanFormat()}</Text>
          </Block>
          {this.state._blocks.map((_Block, i) => {
            return <Block key={i}><_Block item={this.props.item}/></Block>
          })}
        </div>
      </div>
    );
  }
}

export default InfoPanel;

const Block = styled.div`
  display: flex;
  padding: 8px 0;
  font-size: 13px;
  line-height: 20px;
`;
const Label = styled.div`
  flex: 0 0 120px;
  color: #999;
`;
