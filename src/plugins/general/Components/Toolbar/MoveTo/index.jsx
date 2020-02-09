import React, {Component} from 'react';
import CopyToM from '../../ContextMenu/CopyTo';
import {injectModal} from '../../../state/actions';
import {Button} from 'theme-ui';
import icons from '../../../../../assets/icons';

class MoveTo extends Component {

  handleMoveToClick = () => {
    const modal = (props) => {
      return <CopyToM {...props} move={true}/>;
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
            onClick={this.handleMoveToClick}
        >
          {icons.move} Move
        </Button>
    );
  }
}

export default MoveTo;