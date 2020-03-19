import React, {Component} from 'react';
import {Button, Text, Input, Flex, Spinner} from 'theme-ui';
import {getApi} from '../../../tools/config';
import {
  getWorkingPath,
  removeModal,
  setFilter,
  setQuery, setSelectedItems,
  setShouldReload,
  setSort,
  setSortBy,
} from '../../../state/actions';
import {toast} from 'react-toastify';
import icons from '../../../../assets/icons';
import {SmoothScroll} from '../../../../helpers/Utils';
import {getSelectedItemProps} from '../../ItemList';

class RemoteUpload extends Component {
  state = {working: false};

  handleUpload = e => {
    const url = this.refs.remote_url.value;
    if (!url.isValidURL()) {
      toast.warning('Invalid URL');
      return false;
    }
    this.setState({working: true});
    getWorkingPath().then(path => {
      getApi().remote_download(path, url).then(response => {
        toast.success(response.message);

        setFilter({
          sort: 'desc',
          sort_by: 'last_modified',
          query: '',
        });

        setShouldReload(entries => {
          const last = entries.files.reduce((prev, curr) => prev.last_modified > curr.last_modified ? prev : curr);
          setSelectedItems([getSelectedItemProps(last)]);
          console.log(last);
          setTimeout(() => {
            SmoothScroll.scrollTo(last.id);
          }, 300);
          return entries;
        });

        removeModal();
      }).catch(error => {
        toast.error(error.message);
        this.setState({working: false});
      });
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

          <div className="uploadFromUrlWrapper" style={{
            width:'100%',textAlign: 'center'
          }}>
            <Input
                sx={{lineHeight: 2}}
                placeholder="Enter remote file url here"
                autoFocus
                ref="remote_url"
                onKeyDown={this.handleKeyDown}
            />

            <Button
                sx={{py: 2, px: 5, marginTop: 3, display: 'inline-block'}}
                onClick={this.handleUpload}
                disabled={this.state.working}
            >
              {this.state.working ? <Spinner/> : 'Download Now'}
            </Button>

          </div>

        </Flex>
    );
  }
}

export default RemoteUpload;