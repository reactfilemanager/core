/** @jsx jsx */
import { jsx, Button } from 'theme-ui'
import {Component} from 'react';
import toastr from 'toastr';
import {getApi} from '../../../../tools/config';
import {setShouldReload} from '../../../../state/actions';
import {Spinner } from 'theme-ui';
import Popover from 'react-popover';
import icons from '../../../../../../assets/icons';

class CloudDownload extends Component {

  state = {isOpen: false, working: false};

  handleClick = () => {
    this.setState({isOpen: true});
  };

  handleOutsideClick = () => {
    this.setState({isOpen: false});
  };

  handleDownload = () => {
    const url = this.refs.url.value.trim();
    if (url === '') {
      toastr.warning('Empty URL entered');
      return;
    }

    this.setState({working: true});

    getApi()
        .remote_download(this.props.state.path, url)
        .then(response => {
          toastr.success(response.message);

          this.props.dispatch(setShouldReload(true));
          this.setState({isOpen: false});
        })
        .catch(error => {
          toastr.error(error.message);
        })
        .finally(() => {
          this.setState({working: false});
        });
  };

  handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();

      this.handleDownload();
    }
  };

  render() {
    const Body =
        <div className="form-inline p-1">
          <div className="form-group mx-sm-3 mb-2">
            <label htmlFor="url"
                   className="sr-only"
            >
              Enter Remote File URL
            </label>
            <input type="text"
                   className="form-control"
                   id="url"
                   placeholder="https://"
                   ref="url"
                   onKeyDown={this.handleKeyDown}
                   autoFocus
            />
          </div>
          <button className="btn btn-primary mb-2"
                  onClick={this.handleDownload}
                  disabled={this.state.working}
          >
            {
              this.state.working ?
                  <Spinner/>
                  : 'Save'
            }
          </button>
        </div>;

    const attrs = {
      'data-toggle': 'tooltip',
      'data-placement': 'top',
      title: 'Download remote file to this folder',
    };

    return (
        <Popover
            body={Body}
            isOpen={this.state.isOpen}
            onOuterAction={this.handleOutsideClick}
        >
          <Button 
            variant="secondary"
            onClick={this.handleClick}
            {...attrs}
          >
            {
              this.state.working
                  ? <Spinner/>
                  : icons.cloud_download
            }
            <span sx={{ ml: 2 }}>Remote Download</span>
          </Button>
        </Popover>
    );
  }
}

export default CloudDownload;