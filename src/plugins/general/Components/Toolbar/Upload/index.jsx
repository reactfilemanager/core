import React, {Component} from 'react';
import ReactLoading from 'react-loading';
import Popover from 'react-popover';

class Upload extends Component {
  state = {working: false, isOpen: false};

  handleClick = () => {
    this.setState({isOpen: true});
  };

  handleOutsideClick = () => {
    this.setState({isOpen: false});
  };

  render() {
    const Body =
        <div className="form-inline p-1 bg-info">
          <div className="form-group mx-sm-3 mb-2">
            <label htmlFor="name"
                   className="sr-only"
            >
              File Name
            </label>
            <input type="file"
                   className="form-control-file"
                   id="name"
                   placeholder="New File"
                   ref="file"
            />
          </div>
          <button className="btn btn-primary mb-2"
                  onClick={this.handleSave}
                  disabled={this.state.working}
          >
            {
              this.state.working ?
                  <ReactLoading type="spin" height={23} width={12} color="#fff"/>
                  : <i className="fa fa-file-upload"/>
            }
          </button>
        </div>;
    const attrs = {
      'data-toggle': 'tooltip',
      'data-placement': 'top',
      title: 'Upload',
    };

    return (
        <Popover
            body={Body}
            isOpen={this.state.isOpen}
            onOuterAction={this.handleOutsideClick}
        >
          <button className="btn btn-primary"
                  disabled={this.state.isOpen}
                  onClick={this.handleClick}
                  {...attrs}
          >
            <i className="fa fa-file-upload"/>
          </button>
        </Popover>
    );
  }
}

export default Upload;