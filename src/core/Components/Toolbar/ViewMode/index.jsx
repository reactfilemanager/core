/** @jsx jsx */
import {jsx, Flex, Button} from 'theme-ui';
import React, {Component} from 'react';
import {setViewmode} from '../../../state/actions';
import icons from '../../../../assets/icons';

class ViewMode extends Component {

  state = {viewmode: 'grid'};

  handleClick = e => {
    const viewmode = e.currentTarget.getAttribute('data-viewmode');
    if(viewmode === this.state.viewmode) {
      return;
    }
    this.setState({viewmode});
    setViewmode(viewmode);
  };

  render() {
    const viewmode = this.state.viewmode;
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