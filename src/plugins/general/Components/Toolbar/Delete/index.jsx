import React, {Component} from 'react';
import {Button, Spinner} from 'theme-ui';
import {getApi} from '../../../tools/config';
import toastr from 'toastr';
import {remove, removeModal, resetDirectoryTree} from '../../../state/actions';

class Delete extends Component {
  state = {working: false};

  getSelected = () => {
    return [
      ...this.props.state.general.entries.dirs,
      ...this.props.state.general.entries.files,
    ]
        .filter(item => item.selected);
  };

  handleDelete = () => {
    let items = this.getSelected();
    this.setState({working: true});
    for (const item of items) {
      getApi()
          .delete('/', item.path)
          .then(response => {
            toastr.success(response.message);
            this.props.dispatch(remove(item));
            if (item.is_dir) {
              this.props.dispatch(resetDirectoryTree(true));
            }
            this.props.dispatch(removeModal());
          })
          .catch(error => {
            toastr.error(error.message);
            this.setState({working: false});
          });
    }
  };

  render() {
    const selected = this.getSelected();

    return (
        <div className=" p-1">
          <div className="form-group mx-sm-3 mb-2">
            <h3>Are you sure you want to delete these entries?</h3>
            <ol className="list-group">
              {selected.map(item => <li className="list-group-item" key={`${item.name}`}>{item.name}</li>)}
            </ol>
          </div>

          <Button variant="highlight" onClick={this.handleDelete} disabled={this.state.working}>
            {
              this.state.working ? <Spinner title="Deleting"/> : 'Delete'
            }
          </Button>

        </div>
    );
  }
}

export default Delete;