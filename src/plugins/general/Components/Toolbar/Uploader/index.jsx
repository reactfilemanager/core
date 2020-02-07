/** @jsx jsx */
import {jsx, Button} from 'theme-ui';
import React, {Component} from 'react';
import icons from '../../../../../assets/icons';
import Upload from '../../ContextMenu/Upload';
import {injectModal} from '../../../state/actions';
import RemoteUpload from '../../ContextMenu/RemoteUpload';

class Uploader extends Component {

  handleUploadClick = () => {
    const modal = (props) => {
      return <Upload {...props}/>;
    };

    this.props.dispatch(injectModal(modal));
  };

  handleRemoteUploadClick = () => {
    const modal = (props) => {
      return <RemoteUpload {...props}/>;
    };

    this.props.dispatch(injectModal(modal));
  };

  render() {
    return (
        <>
          <Button onClick={this.handleUploadClick}>
            {icons.cloud_upload}
            <span sx={{ml: 2}}>Upload</span>
          </Button>
          <Button onClick={this.handleRemoteUploadClick} variant="secondary">
            {icons.cloud_download}
            <span sx={{ml: 2}}>Remote Download</span>
          </Button>
        </>
    );
  }
}

export default Uploader;