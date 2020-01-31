import React, {Component} from 'react';
import toastr from 'toastr';
import {getApi} from '../../../../config';
import {setShouldReload} from '../../../../state/actions';
import ReactLoading from 'react-loading';
import Popover from 'react-popover';

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
                  <ReactLoading type="spin" height={23} width={12} color="#fff"/>
                  : 'Cloud Download'
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
          <button className="btn btn-primary"
                  onClick={this.handleClick}
                  {...attrs}
          >
            {
              this.state.working
                  ? <ReactLoading type="spin" height={23} width={12} color="#fff"/>
                  : 'Cloud Download'
            }
          </button>
        </Popover>
    );
  }
}

export default CloudDownload;