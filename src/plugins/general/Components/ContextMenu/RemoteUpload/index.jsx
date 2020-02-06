import React, {Component} from 'react';
import {Button, Text, Input, Flex, Spinner} from 'theme-ui';
import {getApi} from '../../../tools/config';
import {setShouldReload} from '../../../state/actions';
import {toast} from 'react-toastify';
import icons from '../../../../../assets/icons'

class RemoteUpload extends Component {
  state = {working: false};

  handleUpload = e => {
    const url = this.refs.remote_url.value;
    if (!url.isValidURL()) {
      toast.warning('Invalid URL');
      return false;
    }
    this.setState({working: true});
    getApi()
        .remote_download(this.props.state.general.path, url)
        .then(response => {
          toast.success(response.message);
          this.props.dispatch(setShouldReload(true));
          this.refs.remote_url.value = '';
        })
        .catch(error => {
          toast.error(error.message);
        })
        .finally(() => {
          this.setState({working: false});
        });
  };

  render() {
    return (
      <Flex sx={{
        flexDirection: 'column', alignItems: 'center',
        p: 4,
        'svg' : { width: '50px', height: '50px' }
      }}>
        {icons.cloud_upload}

        <Text sx={{ fontSize: 22, py: 2,}}>Upload From URL</Text>

        <Input 
          sx={{ lineHeight: 2 }}
          placeholder="Enter remote file url here"
          autoFocus
          ref="name"
          onKeyDown={this.handleKeyDown}
        />

        <Button
          sx={{ py: 2, px: 5, marginTop: 3 }}
          onClick={this.handleUpload}
          disabled={this.state.working}
        >
        { this.state.working ? <Spinner/> : 'Upload Now' }
        </Button>

      </Flex>
    );
  }
}

export default RemoteUpload;