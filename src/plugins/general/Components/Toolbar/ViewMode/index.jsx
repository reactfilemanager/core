/** @jsx jsx */
import {jsx, Flex, Button} from 'theme-ui';
import React, {Component} from 'react';
import {setViewmode} from '../../../state/actions';
import icons from '../../../../../assets/icons';

class ViewMode extends Component {
  handleClick = e => {
    const viewmode = e.currentTarget.getAttribute('data-viewmode');
    this.props.dispatch(setViewmode(viewmode));
  };

  render() {
    const viewmode = this.props.state.viewmode;
    return (
        <Flex sx={{ float: 'left'}}>
          <Button 
            variant="utility"
            className={viewmode === 'grid' ? 'active' : ''}
            data-viewmode="grid" onClick={this.handleClick}
          >
            {icons.grid}
          </Button>
          <Button 
            variant="utility"
            className={viewmode === 'list' ? 'active' : ''}
            data-viewmode="list" onClick={this.handleClick}>
            {icons.list}
          </Button>
        </Flex>
    );
  }
}

export default ViewMode;