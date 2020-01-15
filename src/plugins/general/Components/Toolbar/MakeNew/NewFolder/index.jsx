import React, {Component} from 'react';
import Popover from 'react-popover';
import toastr from 'toastr';
import {getApi} from '../../../../config';
import {setShouldReload, update} from '../../../../state/actions';

class NewFolder extends Component {

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
        .new_dir(this.props.state.path, name)
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
        <div className="form-inline p-1 bg-info">
          <div className="form-group mx-sm-3 mb-2">
            <label htmlFor="name"
                   className="sr-only"
            >
              Folder Name
            </label>
            <input type="text"
                   className="form-control"
                   id="name"
                   placeholder="New Folder"
                   defaultValue="New Folder"
                   ref="name"
                   onKeyDown={this.handleKeyDown}
                   autoFocus
            />
          </div>
          <button className="btn btn-primary mb-2"
                  onClick={this.handleSave}
                  disabled={this.state.working}
          >
            {this.state.working ? 'Spinner' : 'Save'}
          </button>
        </div>;

    return (
        <Popover
            body={Body}
            isOpen={this.state.isOpen}
            onOuterAction={this.handleOutsideClick}
        >
          <button className="btn btn-primary"
                  disabled={this.state.isOpen}
                  onClick={this.handleClick}
          >
            New Folder
          </button>
        </Popover>
    );
  }
}

export default NewFolder;