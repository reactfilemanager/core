import React, {Component} from 'react';
import Upload from './Upload';
import CloudDownload from './CloudDownload';

class Uploader extends Component {
  render() {
    return (
        <div className="btn-group">
          <Upload state={this.props.state} dispatch={this.props.dispatch}/>
          <CloudDownload state={this.props.state} dispatch={this.props.dispatch}/>
        </div>
    );
  }
}

export default Uploader;