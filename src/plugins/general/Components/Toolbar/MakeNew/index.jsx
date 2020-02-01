import React, {Component} from 'react';
import NewFolder from './NewFolder';
import NewFile from './NewFile';

class MakeNew extends Component {
  render() {
    return (
      <>
        <NewFolder key="new_folder" state={this.props.state} dispatch={this.props.dispatch} />
      </>
        // <div className="btn-group">
        //   <NewFile
        //       key="new_file"
        //       state={this.props.state}
        //       dispatch={this.props.dispatch}
        //   />
          
        // </div>
    );
  }
}

export default MakeNew;