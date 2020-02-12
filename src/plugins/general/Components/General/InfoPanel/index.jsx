/** @jsx jsx*/
import {jsx, Box, Heading, Text, Close } from 'theme-ui';
import React, {Component} from 'react';
import styled from '@emotion/styled';
import icons from '../../../../../assets/icons';
import {FILE_TYPES} from '../../Toolbar/FilterByType';

class InfoPanel extends Component {

  state = {isOpen: false};

  componentDidMount() {
    this.setState({isOpen: true});
  }

  get isImage() {
    return FILE_TYPES.image.indexOf(this.props.item.extension) >= 0;
  }

  closePanel = () => {
    this.setState({ isOpen: false })
  };

  render() {
    const item = this.props.item;
    return (
      <Box sx={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '320px',
        height: '100%',
        bg: 'white',
        p: 3,
        borderLeft: '1px solid #ddd',
        transition: 'transform 0.2s ease-out',
        transform: (this.state.isOpen) ? 'translateX(0)' : 'translateX(340px)'
      }}>
        <Heading as='h2'>{icons.info} Details</Heading>
        <Box sx={{ marginTop: 4 }}>
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
        </Box>

        <Close sx={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          cursor: 'pointer'
        }} onClick={this.closePanel} />
      </Box>

        // <table>
        //   <tbody>
        //   {this.isImage ?
        //       <>
        //         <tr>
        //           <td>Dimension</td>
        //           <td>
        //             {`${item.image_info.width}x${item.image_info.width}`}
        //           </td>
        //         </tr>
        //         <tr>
        //           <td>Bits</td>
        //           <td>
        //             {item.image_info.bits}
        //           </td>
        //         </tr>
        //         <tr>
        //           <td>Channels</td>
        //           <td>
        //             {item.image_info.channels}
        //           </td>
        //         </tr>
        //         <tr>
        //           <td>Mime Type</td>
        //           <td>
        //             {item.image_info.mime}
        //           </td>
        //         </tr>
        //       </>
        //       : null}
        //   </tbody>
        // </table>
    );
  }
}

export default InfoPanel;

const Block = styled.div`
  display: flex;
  padding: 8px 0;
  font-size: 13px;
  line-height: 20px;
`
const Label = styled.div`
  flex: 0 0 120px;
  color: #999;
`