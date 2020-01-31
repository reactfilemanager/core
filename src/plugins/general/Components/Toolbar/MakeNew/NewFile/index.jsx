import React, {Component} from 'react';
import toastr from 'toastr';
import {getApi} from '../../../../config';
import {setShouldReload} from '../../../../state/actions';
import Popover from 'react-popover';
import ReactLoading from 'react-loading';

class NewFile extends Component {

  state = {working: false, isOpen: false};

  handleClick = () => {
    this.setState({isOpen: true});
  };

  handleOutsideClick = () => {
    this.setState({isOpen: false});
  };

  handleSave = () => {
    const name = this.refs.name.value.trim();
    if (name === '') {
      toastr.warning('Empty name entered');
      return;
    }

    this.setState({working: true});
    getApi()
        .new_file(this.props.state.path, name, "")
        .then(response => {
          toastr.success(response.message);
          // reload
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

      this.handleSave();
    }
  };

  render() {
    const Body =
        <div className="form-inline p-1">
          <div className="form-group mx-sm-3 mb-2">
            <label htmlFor="name"
                   className="sr-only"
            >
              File Name
            </label>
            <input type="text"
                   className="form-control"
                   id="name"
                   placeholder="New File"
                   defaultValue="New File.txt"
                   ref="name"
                   onKeyDown={this.handleKeyDown}
                   autoFocus
            />
          </div>
          <button className="btn btn-primary mb-2"
                  onClick={this.handleSave}
                  disabled={this.state.working}
          >
            {
              this.state.working ?
                  <ReactLoading type="spin" height={23} width={12} color="#fff"/>
                  : 'New File'
            }
          </button>
        </div>;
    const attrs = {
      'data-toggle': 'tooltip',
      'data-placement': 'top',
      title: 'New File',
    };

    return (
        <Popover
            body={Body}
            isOpen={this.state.isOpen}
            onOuterAction={this.handleOutsideClick}
        >
          <button className="btn btn-primary"
                  disabled={this.state.isOpen}
                  onClick={this.handleClick}
                  {...attrs}
          >
            New File
          </button>
        </Popover>
    );
  }
}

export default NewFile;