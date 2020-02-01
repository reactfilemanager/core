import React, {Component} from 'react';
import Upload from './Upload';
import CloudDownload from './CloudDownload';

class Uploader extends Component {
  render() {
    return (
        <>
          <Upload state={this.props.state} dispatch={this.props.dispatch}/>
          <CloudDownload state={this.props.state} dispatch={this.props.dispatch}/>
        </>
    );
  }
}

export default Uploader;