import React, {Component} from 'react';
import NewFolder from '../../Modals/NewFolder';
import {injectModal} from '../../../state/actions';
import {Button} from 'theme-ui';
import icons from '../../../../../assets/icons';

class MakeNew extends Component {

  handleNewFolderClick = () => {
    const modal = (props) => {
      return <NewFolder {...props}/>;
    };

    this.props.dispatch(injectModal(modal));
  };

  render() {
    return (
        <>
          <Button
            variant="secondary"
            onClick={this.handleNewFolderClick}
          >
            {icons.plus} New Folder
          </Button>
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