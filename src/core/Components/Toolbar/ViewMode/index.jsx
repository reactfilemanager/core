/** @jsx jsx */
import {jsx, Flex, Button} from 'theme-ui';
import React, {Component} from 'react';
import {setViewmode} from '../../../state/actions';
import icons from '../../../../assets/icons';

class ViewMode extends Component {
  handleClick = e => {
    const viewmode = e.currentTarget.getAttribute('data-viewmode');
    this.props.dispatch(setViewmode(viewmode));
  };

  render() {
    const viewmode = this.props.state.viewmode;
    return (
        <Flex sx={{float: 'left'}}>
          {viewmode === 'list'
              ? <Button
                  variant="utility"
                  className="active"
                  data-viewmode="grid" onClick={this.handleClick}
                  title="Grid"
              >
                {icons.grid}
              </Button>
              : <Button
                  variant="utility"
                  className="active"
                  data-viewmode="list" onClick={this.handleClick}
                  title="List">
                {icons.list}
              </Button>
          }
        </Flex>
    );
  }
}

export default ViewMode;