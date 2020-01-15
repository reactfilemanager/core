import React, {Component} from 'react';
import Popover from 'react-popover';
import {getApi} from '../../../config';
import toastr from 'toastr';
import {remove, update} from '../../../state/actions';

class Delete extends Component {
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

    return items;
  };

  handleClick = () => {
    this.setState({isOpen: true});
  };

  handleOutsideClick = () => {
    this.setState({isOpen: false});
  };

  handleDelete = () => {
    let items = this.getSelected();
    for(const item of items) {
      getApi()
          .delete('/', item.path)
          .then(response => {
            toastr.success(response.message);
            this.props.dispatch(remove(item));
            this.setState({isOpen: false});
          })
          .catch(error => {
            toastr.error(error.message);
          })
          .finally(() => {
            this.setState({working: false});
          })
    }
  };

  render() {
    const selected = this.getSelected();
    const Body = selected.length > 0 ?
        <div className=" p-1 bg-info">
          <div className="form-group mx-sm-3 mb-2">
            <h3>Are you sure you want to delete this entries?</h3>
            <ol className="list-group">
              {selected.map(item => <li className="list-group-item" key={`${item.name}`}>{item.name}</li>)}
            </ol>
          </div>
          <button className="btn btn-primary mb-2"
                  onClick={this.handleDelete}
                  disabled={this.state.working}
          >
            {this.state.working ? 'Spinner' : 'DELETE'}
          </button>
        </div>
        : <p>Please select at least one item</p>;

    return (
        <Popover
            body={Body}
            isOpen={this.state.isOpen}
            onOuterAction={this.handleOutsideClick}
        >
          <button className="btn btn-primary"
                  disabled={selected.length === 0}
                  onClick={this.handleClick}
          >
            Delete
          </button>
        </Popover>
    );
  }
}

export default Delete;