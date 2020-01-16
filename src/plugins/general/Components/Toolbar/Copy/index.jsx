import React, {Component} from 'react';
import Popover from 'react-popover';
import {getApi} from '../../../config';
import toastr from 'toastr';
import {remove, setShouldReload} from '../../../state/actions';

class Copy extends Component {

  state = {clipboard: [], isOpen: false, working: false};

  componentDidMount() {
    // this.refs.copy.addEventListener()
  }

  componentWillUnmount() {

  }

  handleCopy = () => {
    const clipboard = this.getSelected();
    if (!clipboard.length) {
      return;
    }

    this.setState({clipboard});
  };

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

  handlePaste = () => {
    this.setState({working: true});
    const promises = [];
    for (const item of this.state.clipboard) {
      promises.push(getApi().copy('/', item.path, this.props.state.path));
    }

    Promise.all(promises)
           .then(response => {
             toastr.success('Delete successful');
             this.setState({isOpen: false});
             this.props.dispatch(setShouldReload(true));
           })
           .catch(error => {
             toastr.error('Could not delete all file(s)/folder(s)');
             console.log(error);
           })
           .finally(() => {
             this.setState({working: false});
           });
  };

  handleClick = () => {
    this.setState({isOpen: true});
  };

  handleOutsideClick = () => {
    this.setState({isOpen: false});
  };

  render() {
    const hasCopy = this.state.clipboard.length > 0;
    const Body =
        <div className=" p-1 bg-info">
          <div className="form-group mx-sm-3 mb-2">
            <h3>Are you sure you want to paste these entries here?</h3>
            <ol className="list-group">
              {this.state.clipboard.map(item => <li className="list-group-item" key={`${item.name}`}>{item.name}</li>)}
            </ol>
          </div>
          <button className="btn btn-primary mb-2"
                  onClick={this.handlePaste}
                  disabled={this.state.working}
          >
            {this.state.working ? 'Spinner' : 'Paste'}
          </button>
        </div>;

    return [
      <button className="btn btn-primary" ref="copy" key="copy" onClick={this.handleCopy}>Copy</button>,
      <Popover
          key="paste"
          body={Body}
          isOpen={this.state.isOpen}
          onOuterAction={this.handleOutsideClick}
      >
        <button className="btn btn-primary" ref="paste" onClick={this.handleClick}
                disabled={!hasCopy}>Paste
        </button>
      </Popover>,
    ];
  }
}

export default Copy;