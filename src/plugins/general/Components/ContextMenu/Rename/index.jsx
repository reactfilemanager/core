import React, {Component} from 'react';
import {Button} from 'theme-ui'
import toastr from 'toastr';
import Popover from 'react-popover';
import {getApi} from '../../../tools/config';
import {removeModal, update} from '../../../state/actions';
import {Spinner } from 'theme-ui';

class Rename extends Component {

  state = {working: false};

  getSelected = () => {
    return this.props.item;
  };

  handleSave = () => {
    const name = this.refs.name.value.trim();
    if (name === '') {
      toastr.warning('Empty name entered');
      return;
    }

    this.setState({working: true});
    const item = this.getSelected();
    getApi()
        .rename(this.props.state.path, item.name, name)
        .then(response => {
          toastr.success(response.message);
          // update name
          item.name = name;
          // update path
          const path = item.path.split('/');
          path.pop();
          item.path = [...path, item.name].join('/');

          this.props.dispatch(update(item));
          this.props.dispatch(removeModal());
        })
        .catch(error => {
          toastr.error(error.message);
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
    const selected = this.getSelected();
    return (
        <div className="form-inline p-1">
          <div className="form-group mx-sm-3 mb-2">
            <label htmlFor="name"
            >
              Enter {selected.is_dir ? 'Folder Name' : 'File Name'}
            </label>
            <input type="text"
                   className="form-control"
                   id="name"
                   placeholder="name"
                   defaultValue={selected.name}
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
                  <Spinner/>
                  : 'Rename'
            }
          </button>
        </div>
    );
  }
}

export default Rename;