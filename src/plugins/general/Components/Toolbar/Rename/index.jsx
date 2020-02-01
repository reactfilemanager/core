import React, {Component} from 'react';
import {Button} from 'theme-ui'
import toastr from 'toastr';
import Popover from 'react-popover';
import {getApi} from '../../../tools/config';
import {update} from '../../../state/actions';
import ReactLoading from 'react-loading';

class Rename extends Component {

  state = {isOpen: false, working: false};

  getSelected = () => {
    const all_selected = [
      ...this.props.state.entries.dirs,
      ...this.props.state.entries.files,
    ]
        .filter(item => item.selected);
    return all_selected.length === 1 ? all_selected[0] : null;
  };

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
    const selected = this.getSelected();
    const Body = selected ?
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
                  <ReactLoading type="spin" height={23} width={12} color="#fff"/>
                  : 'Rename'
            }
          </button>
        </div>
        : <p>Please select single item</p>;

    const attrs = {
      'data-toggle': 'tooltip',
      'data-placement': 'top',
      title: 'Rename',
    };

    return (
        <Popover
            body={Body}
            isOpen={this.state.isOpen}
            onOuterAction={this.handleOutsideClick}
        >
          <Button 
            variant="secondary"
            disabled={selected === null}
            onClick={this.handleClick}
            {...attrs}
          >
            Rename
          </Button>
        </Popover>
    );
  }
}

export default Rename;