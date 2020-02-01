import React, {Component} from 'react';
import CloudDownload from './CloudDownload';
import icons from '../../../../../assets/icons';
import Upload from '../../Upload';
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
          <button onClick={this.handleUploadClick}>{icons.cloud_upload} Upload</button>
          <CloudDownload state={this.props.state} dispatch={this.props.dispatch}/>
        </>
    );
  }
}

export default Uploader;