/** @jsx jsx */
import {jsx, Button, Box} from 'theme-ui';
import React, {Component} from 'react';
import icons from '../../../../../assets/icons';
import Upload from '../../ContextMenu/Upload';
import {injectModal} from '../../../state/actions';
import RemoteUpload from '../../ContextMenu/RemoteUpload';

class Uploader extends Component {

  state = {isOpen: false};

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
        <Box sx={{ position: 'relative' }}>

          <Button onClick={this.toggleDropdown}>
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
                width: '100%',
                borderRadius: '3px',
                zIndex: '1'
              }}>
                <Box sx={{ p: 2 }} onClick={this.handleUploadClick}>
                  {icons.upload}
                  <span sx={{ml: 2}}>Upload from computer</span>
                </Box>

                <Box sx={{ p: 2 }} onClick={this.handleRemoteUploadClick}>
                  {icons.cloud_upload}
                  <span sx={{ml: 2}}>Upload From URL</span>
                </Box>
              </div>
            : null
          }
        </Box>
    );
  }
}

export default Uploader;