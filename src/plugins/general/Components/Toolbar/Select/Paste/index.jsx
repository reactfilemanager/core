import React, {Component} from 'react';
import Popover from 'react-popover';
import {getApi} from '../../../../config';
import toastr from 'toastr';
import {setShouldReload} from '../../../../state/actions';

class Paste extends Component {

  state = {working: false, isOpen: false};

  handleClick = () => {
    this.setState({isOpen: true});
  };

  handleOutsideClick = () => {
    this.setState({isOpen: false});
  };

  handlePaste = () => {
    this.setState({working: true});
    const promises = [];
    for (const item of this.props.clipboard) {
      promises.push(getApi().copy('/', item.path, this.props.state.path));
    }

    Promise.all(promises)
           .then(response => {
             console.log(response);
             toastr.success('Copy successful');
             this.setState({isOpen: false});
             this.props.dispatch(setShouldReload(true));
           })
           .catch(error => {
             toastr.error('Could not copy all file(s)/folder(s)');
             console.log(error);
           })
           .finally(() => {
             this.setState({working: false});
           });
  };

  render() {
    const clipboard = this.props.clipboard || [];
    const hasCopy = clipboard.length > 0;
    const Body =
        <div className=" p-1 bg-info">
          <div className="form-group mx-sm-3 mb-2">
            <h3>Are you sure you want to paste these entries here?</h3>
            <ol className="list-group">
              {clipboard.map(item => <li className="list-group-item" key={`${item.name}`}>{item.name}</li>)}
            </ol>
          </div>
          <button className="btn btn-primary mb-2"
                  onClick={this.handlePaste}
                  disabled={this.state.working}
          >
            {this.state.working ? 'Spinner' : 'Paste'}
          </button>
        </div>;
    return (
        <Popover
            key="paste"
            body={Body}
            isOpen={this.state.isOpen}
            onOuterAction={this.handleOutsideClick}
        >
          <button className="btn btn-primary" ref="paste" onClick={this.handleClick}
                  disabled={!hasCopy}>Paste
          </button>
        </Popover>
    );
  }
}

export default Paste;