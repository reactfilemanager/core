/** @jsx jsx */
import {jsx, Button, Box, Flex, Text} from 'theme-ui';
import React, {Component} from 'react';
import icons from '../../../../assets/icons';
import Upload from '../../Utilities/Upload';
import {injectModal} from '../../../state/actions';
import RemoteUpload from '../../Utilities/URLDownload';
import {EventBus} from '../../../../helpers/Utils';

class Uploader extends Component {

  state = {isOpen: false};

  componentDidMount() {
    EventBus.$on(['click', 'contextmenu'], this.closeDropdown);
  }

  componentWillUnmount() {
    EventBus.$off(['click', 'contextmenu'], this.closeDropdown);
  }

  closeDropdown = e => {
    if (this.refs.btn.isIn(e.path)) {
      return;
    }
    this.setState({isOpen: false});
  };

  handleUploadClick = () => {
    const modal = (props) => {
      return <Upload {...props}/>;
    };

    this.toggleDropdown();
    this.props.dispatch(injectModal(modal));
  };

  handleRemoteUploadClick = () => {
    const modal = (props) => {
      return <RemoteUpload {...props}/>;
    };

    this.toggleDropdown();
    this.props.dispatch(injectModal(modal));
  };

  toggleDropdown = () => {
    this.setState({isOpen: !this.state.isOpen});
  };

  render() {
    return (
        <div sx={{position: 'relative'}}>

          <Button onClick={this.toggleDropdown} ref="btn">
            {icons.cloud_upload} Upload
          </Button>
          {
            this.state.isOpen ?
                <div sx={{
                  position: 'absolute',
                  left: 0,
                  top: '40px',
                  background: 'white',
                  boxShadow: '0 0 4px #ccc',
                  width: '240px',
                  borderRadius: '3px',
                  zIndex: '1',
                  textTransform: 'uppercase',
                  fontSize: 14,
                  cursor: 'pointer',
                }}>
                  <Flex sx={{p: 2, '&:hover, &:focus': {bg: 'primaryLight'}}}
                        onClick={this.handleUploadClick}>
                    {icons.upload}
                    <Text sx={{ml: 2}}>Upload from computer</Text>
                  </Flex>

                  <Flex sx={{p: 2, '&:hover, &:focus': {bg: 'primaryLight'}}}
                        onClick={this.handleRemoteUploadClick}>
                    {icons.cloud_upload}
                    <Text sx={{ml: 2}}>Upload From URL</Text>
                  </Flex>
                </div>
                : null
          }
        </div>
    );
  }
}

export default Uploader;