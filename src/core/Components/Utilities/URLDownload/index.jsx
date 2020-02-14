import React, {Component} from 'react';
import {Button, Text, Input, Flex, Spinner} from 'theme-ui';
import {getApi} from '../../../tools/config';
import {removeModal, setQuery, setShouldReload, setSort, setSortBy} from '../../../state/actions';
import {toast} from 'react-toastify';
import icons from '../../../../assets/icons';
import {SmoothScroll} from '../../../../helpers/Utils';

class RemoteUpload extends Component {
  state = {working: false};

  handleUpload = e => {
    const url = this.refs.remote_url.value;
    if (!url.isValidURL()) {
      toast.warning('Invalid URL');
      return false;
    }
    this.setState({working: true});
    getApi().remote_download(this.props.state.core.path, url).then(response => {
      toast.success(response.message);
      this.props.dispatch(setSort('desc'));
      this.props.dispatch(setSortBy('last_modified'));
      this.props.dispatch(setQuery(''));
      this.props.dispatch(setShouldReload(true, entries => {
        const last = entries.files.reduce((prev, curr) => prev.last_modified > curr.last_modified ? prev : curr);
        last.selected = true;
        setTimeout(() => {
          SmoothScroll.scrollTo(last.id);
        }, 300);
        return entries;
      }));
      this.props.dispatch(removeModal());
    }).catch(error => {
      toast.error(error.message);
      this.setState({working: false});
    });
  };

  handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();

      this.handleUpload(e);
    }
  };

  render() {
    return (
        <Flex sx={{
          flexDirection: 'column', alignItems: 'center',
          p: 4,
          'svg': {width: '50px', height: '50px'},
        }}>
          {icons.cloud_upload}

          <Text sx={{fontSize: 22, py: 2}}>Upload From URL</Text>

          <Input
              sx={{lineHeight: 2}}
              placeholder="Enter remote file url here"
              autoFocus
              ref="remote_url"
              onKeyDown={this.handleKeyDown}
          />

          <Button
              sx={{py: 2, px: 5, marginTop: 3}}
              onClick={this.handleUpload}
              disabled={this.state.working}
          >
            {this.state.working ? <Spinner/> : 'Download Now'}
          </Button>

        </Flex>
    );
  }
}

export default RemoteUpload;