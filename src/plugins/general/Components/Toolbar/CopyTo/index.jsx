import React, {Component} from 'react';
import CopyToM from '../../ContextMenu/CopyTo';
import {injectModal} from '../../../state/actions';
import {Button} from 'theme-ui';
import icons from '../../../../../assets/icons';

class CopyTo extends Component {

  handleCopyToClick = () => {
    const modal = (props) => {
      return <CopyToM {...props} move={false}/>;
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
            onClick={this.handleCopyToClick}
        >
          {icons.copy} Copy To
        </Button>
    );
  }
}

export default CopyTo;