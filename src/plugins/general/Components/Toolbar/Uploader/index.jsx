/** @jsx jsx */
import { jsx, Button } from 'theme-ui'
import React, {Component} from 'react';
import CloudDownload from './CloudDownload';
import icons from '../../../../../assets/icons';
import Upload from '../../ContextMenu/Upload';
import {injectModal} from '../../../state/actions';

class Uploader extends Component {

  handleUploadClick = () => {
    const modal = (props) => {
      return <Upload {...props}/>;
    };

    this.props.dispatch(injectModal(modal));
  };

  render() {
    return (
        <>
          <Button onClick={this.handleUploadClick}>
            {icons.cloud_upload}
            <span sx={{ ml: 2 }}>Upload</span>
          </Button>
          <CloudDownload state={this.props.state} dispatch={this.props.dispatch}/>
        </>
    );
  }
}

export default Uploader;