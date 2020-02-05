import React, {Component} from 'react';
import {Button, Input, Spinner} from 'theme-ui';
import {getApi} from '../../../tools/config';
import icons from '../../../../../assets/icons';
import {setShouldReload} from '../../../state/actions';
import toastr from 'toastr';

class RemoteUpload extends Component {
  state = {working: false};

  handleUpload = e => {
    const url = this.refs.remote_url.value;
    if (!url.isValidURL()) {
      toastr.warning('Invalid URL');
      return false;
    }
    this.setState({working: true});
    getApi()
        .remote_download(this.props.state.general.path, url)
        .then(response => {
          toastr.success(response.message);
          this.props.dispatch(setShouldReload(true));
          this.refs.remote_url.value = '';
        })
        .catch(error => {
          toastr.error(error.message);
        })
        .finally(() => {
          this.setState({working: false});
        });
  };

  render() {
    return (
        <div className="p-1 min-w-300px">
          <div className="form-group mx-sm-3 mb-2">
            <h3>Upload File</h3>

            <div className="row">
              <div className="col-md-12">
                <Input type="text" className="form-control" ref="remote_url" placeholder="Enter remote file URL"/>
              </div>
            </div>

            {this.state.working
                ? <Spinner/>
                : <Button onClick={this.handleUpload}>
                  {icons.cloud_upload} Upload
                </Button>
            }
          </div>
        </div>
    );
  }
}

export default RemoteUpload;