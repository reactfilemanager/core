import React, {Component} from 'react';
import toastr from 'toastr';
import Popover from 'react-popover';
import {getApi} from '../../../config';
import {update} from '../../../state/actions';

class Rename extends Component {

  state = {isOpen: false, working: false};

  getSelected = () => {
    let items = [];
    this.props.state.entries.dirs.forEach(dir => {
      if (dir.selected) {
        items.push(dir);
      }
    });

    this.props.state.entries.files.forEach(file => {
      if (file.selected) {
        items.push(file);
      }
    });

    if (items.length !== 1) {
      return false;
    }
    return items[0];
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

  render() {
    const selected = this.getSelected();
    const Body = selected ?
        <div className="form-inline p-1 bg-info">
          <div className="form-group mx-sm-3 mb-2">
            <label htmlFor="name" className="sr-only">Enter {selected.is_dir ? 'Folder Name' : 'File Name'}</label>
            <input type="text" className="form-control" id="name" placeholder="name" defaultValue={selected.name}
                   ref="name"/>
          </div>
          <button className="btn btn-primary mb-2"
                  onClick={this.handleSave}
                  disabled={this.state.working}
          >
            {this.state.working ? 'Spinner' : 'Save'}
          </button>
        </div>
        : <p>Please select single item</p>;

    return (
        <Popover
            body={Body}
            isOpen={this.state.isOpen}
            onOuterAction={this.handleOutsideClick}
        >
          <button className="btn btn-primary"
                  disabled={selected === false}
                  onClick={this.handleClick}
          >
            Rename
          </button>
        </Popover>
    );
  }
}

export default Rename;