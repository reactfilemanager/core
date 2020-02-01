import React, {Component} from 'react';
import {Button} from 'theme-ui'
import Popover from 'react-popover';
import {getApi} from '../../../../tools/config';
import toastr from 'toastr';
import {setShouldReload} from '../../../../state/actions';
import ReactLoading from 'react-loading';
import icons from '../../../../../../assets/icons';

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
    for (const item of this.props.state.clipboard) {
      promises.push(getApi().copy('/', item.path, this.props.state.path));
    }

    Promise.all(promises)
           .then(response => {
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
    const clipboard = this.props.state.clipboard || [];
    const hasCopy = clipboard.length > 0;
    const Body =
        <div className=" p-1">
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
            {
              this.state.working ?
                  <ReactLoading type="spin" height={23} width={12} color="#fff"/>
                  : 'Paste'
            }
          </button>
        </div>;
    const attrs = {
      'data-toggle': 'tooltip',
      'data-placement': 'top',
      title: 'Copy Here',
    };
    return (
        <Popover
            key="paste"
            body={Body}
            isOpen={this.state.isOpen}
            onOuterAction={this.handleOutsideClick}
        >
          <Button 
            variant="secondary"
            ref="paste"
            onClick={this.handleClick}
            disabled={!hasCopy}
            {...attrs}
          >
            {icons.copy}
          </Button>
        </Popover>
    );
  }
}

export default Paste;