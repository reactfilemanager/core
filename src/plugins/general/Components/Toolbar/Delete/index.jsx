import React, {Component} from 'react';
import { Button, Spinner } from 'theme-ui'
import Popover from 'react-popover';
import ReactLoading from 'react-loading';
import {getApi} from '../../../config';
import toastr from 'toastr';
import {remove, resetDirectoryTree, setClipboard, update} from '../../../state/actions';
import icons from '../../../../../assets/icons';

console.log(icons);

class Delete extends Component {
  state = {isOpen: false, working: false};

  getSelected = () => {
    return [
      ...this.props.state.entries.dirs,
      ...this.props.state.entries.files,
    ]
        .filter(item => item.selected);
  };

  handleClick = () => {
    this.setState({isOpen: true});
  };

  handleOutsideClick = () => {
    this.setState({isOpen: false});
  };

  handleDelete = () => {
    let items = this.getSelected();
    this.setState({working: true});
    for (const item of items) {
      getApi()
          .delete('/', item.path)
          .then(response => {
            toastr.success(response.message);
            this.setState({isOpen: false});
            this.props.dispatch(remove(item));
            const clipboard = this.props.state.clipboard.filter(_item => _item !== item);
            this.props.dispatch(setClipboard(clipboard));
            if (item.is_dir) {
              this.props.dispatch(resetDirectoryTree(true));
            }
          })
          .catch(error => {
            toastr.error(error.message);
          })
          .finally(() => {
            this.setState({working: false});
          });
    }
  };

  render() {
    const selected = this.getSelected();
    const Body = selected.length > 0 ?
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
        : <p>Please select at least one item</p>;

    const attrs = {
      'data-toggle': 'tooltip',
      'data-placement': 'top',
      title: 'Delete',
    };

    return (
        <Popover
            body={Body}
            isOpen={this.state.isOpen}
            onOuterAction={this.handleOutsideClick}
        >
          <Button 
            variant='secondary' 
            disabled={selected.length === 0}
            onClick={this.handleClick}
            {...attrs}>
              {icons.trash} Delete
            </Button>
        </Popover>
    );
  }
}

export default Delete;