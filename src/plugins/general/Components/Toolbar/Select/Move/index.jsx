import React, {Component} from 'react';
import {Button} from 'theme-ui'
import {getApi} from '../../../../tools/config';
import {setClipboard, setShouldReload} from '../../../../state/actions';
import Popover from 'react-popover';
import {Spinner } from 'theme-ui';
import icons from '../../../../../../assets/icons';
import {toast} from 'react-toastify';

class Move extends Component {

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
      promises.push(getApi().move('/', item.path, this.props.state.path));
    }

    Promise.all(promises)
           .then(response => {
             console.log(response);
             toast.success('Move successful');
             this.setState({isOpen: false});
             this.props.dispatch(setShouldReload(true));
             this.props.dispatch(setClipboard([]));
           })
           .catch(error => {
             toast.error('Could not move all file(s)/folder(s)');
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
            <h3>Are you sure you want to move these entries here?</h3>
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
                  <Spinner/>
                  : 'Move'
            }
          </button>
        </div>;
    const attrs = {
      'data-toggle': 'tooltip',
      'data-placement': 'top',
      title: 'Move Here',
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
            ref="move"
            onClick={this.handleClick}
            disabled={!hasCopy}
            {...attrs}
          >
            {icons.move}
          </Button>
        </Popover>
    );
  }
}

export default Move;