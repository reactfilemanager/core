import React, {Component} from 'react';
import DeleteM from '../../ContextMenu/Delete';
import {injectModal} from '../../../state/actions';
import {Button} from 'theme-ui';
import icons from '../../../../../assets/icons';

class Delete extends Component {

  handleDeleteClick = () => {
    const modal = (props) => {
      return <DeleteM {...props}/>;
    };

    this.props.dispatch(injectModal(modal));
  };

  get shouldShow() {
    return [
      ...this.props.state.entries.dirs,
      ...this.props.state.entries.files,
    ].filter(item => item.selected).length > 0;
  }

  render() {
    if (!this.shouldShow) {
      return null;
    }
    return (
        <Button
            variant="secondary"
            onClick={this.handleDeleteClick}
        >
          {icons.trash} Delete
        </Button>
    );
  }
}

export default Delete;