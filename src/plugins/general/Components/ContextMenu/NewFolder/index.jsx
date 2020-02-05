import React, {Component} from 'react';
import {Button, Label, Input} from 'theme-ui';
import toastr from 'toastr';
import {Spinner} from 'theme-ui';
import {getApi} from '../../../tools/config';
import {removeModal, setShouldReload} from '../../../state/actions';

class NewFolder extends Component {

  state = {working: false};

  handleSave = () => {
    const name = this.refs.name.value.trim();
    if (name === '') {
      toastr.warning('Empty name entered');
      return;
    }

    this.setState({working: true});
    getApi()
        .new_dir(this.props.state.general.path, name)
        .then(response => {
          toastr.success(response.message);
          // reload
          this.props.dispatch(setShouldReload(true));
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
    return (
        <div className="form-inline p-1">
          <div className="form-group mx-sm-3 mb-2">
            <Label htmlFor="name"
                   className="sr-only"
            >
              Folder Name
            </Label>
            <Input type="text"
                   className="form-control"
                   id="name"
                   placeholder="New Folder"
                   defaultValue="New Folder"
                   ref="name"
                   onKeyDown={this.handleKeyDown}
                   autoFocus
            />
          </div>
          <Button className="btn btn-primary mb-2"
                  onClick={this.handleSave}
                  disabled={this.state.working}
          >
            {
              this.state.working ?
                  <Spinner/>
                  : 'New Folder'
            }
          </Button>
        </div>
    );
  }
}

export default NewFolder;