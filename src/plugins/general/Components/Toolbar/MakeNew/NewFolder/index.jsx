import React, {Component} from 'react';
import {Button} from 'theme-ui'
import Popover from 'react-popover';
import {getApi} from '../../../../tools/config';
import {setShouldReload, update} from '../../../../state/actions';
import {Spinner } from 'theme-ui';
import icons from '../../../../../../assets/icons';
import {toast} from 'react-toastify';

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
      toast.warning('Empty name entered');
      return;
    }

    this.setState({working: true});
    getApi()
        .new_dir(this.props.state.path, name)
        .then(response => {
          toast.success(response.message);
          // reload
          this.props.dispatch(setShouldReload(true));
          this.setState({isOpen: false});
        })
        .catch(error => {
          toast.error(error.message);
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
            {
              this.state.working ?
                  <Spinner/>
                  : 'New Folder'
            }
          </button>
        </div>;

    const attrs = {
      'data-toggle': 'tooltip',
      'data-placement': 'top',
      title: 'New Folder',
    };

    return (
        <Popover
            body={Body}
            isOpen={this.state.isOpen}
            onOuterAction={this.handleOutsideClick}
        >
          <Button 
            variant="secondary"
            disabled={this.state.isOpen}
            onClick={this.handleClick}
            {...attrs}
          >
            {icons.plus} New Folder
          </Button>
        </Popover>
    );
  }
}

export default NewFolder;